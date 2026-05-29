"""
Authentication Router
---------------------
Exposes all auth-related HTTP endpoints:

  GET  /api/v1/auth/login          -> Redirects to Google OAuth consent screen
  GET  /api/v1/auth/callback       -> Handles the OAuth callback from Google
  POST /api/v1/auth/login          -> Email/password login (local accounts)
  GET  /api/v1/auth/me             -> Returns the currently authenticated user
  POST /api/v1/auth/logout         -> Clears the session cookie

The helpers that generate URLs, validate ID tokens and create JWTs live in
`core/auth.py`.  Business logic (DB access, token issuance) lives in
`services/auth.py`.
"""

import logging
from typing import Optional

import httpx
from core.auth import (
    IDTokenValidationError,
    build_authorization_url,
    build_logout_url,
    generate_code_challenge,
    generate_code_verifier,
    generate_nonce,
    generate_state,
    validate_id_token,
)
from core.config import settings
from dependencies.auth import get_current_user, get_current_user_optional
from dependencies.database import get_db
from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, EmailStr
from services.auth import AuthService
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _set_token_cookie(response: Response, token: str) -> None:
    """Set the JWT as an HttpOnly cookie."""
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,           # set True in production (HTTPS)
        samesite="lax",
        max_age=int(getattr(settings, "jwt_expire_minutes", 1440)) * 60,
        path="/",
    )


def _clear_token_cookie(response: Response) -> None:
    response.delete_cookie(key="access_token", path="/")


# ---------------------------------------------------------------------------
# Google OIDC – initiate login
# ---------------------------------------------------------------------------

@router.get("/login", summary="Redirect to Google OAuth consent screen")
async def login(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Starts the Google OIDC flow with PKCE.
    Stores state/nonce/code_verifier in the DB and redirects the browser to Google.
    """
    state = generate_state()
    nonce = generate_nonce()
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)

    auth_service = AuthService(db)
    await auth_service.store_oidc_state(state, nonce, code_verifier)

    redirect_uri = f"{settings.backend_url}/api/v1/auth/callback"
    auth_url = build_authorization_url(
        state=state,
        nonce=nonce,
        code_challenge=code_challenge,
        redirect_uri=redirect_uri,
    )

    logger.info("Redirecting user to Google OAuth consent screen")
    return RedirectResponse(url=auth_url, status_code=status.HTTP_302_FOUND)


# ---------------------------------------------------------------------------
# Google OIDC – callback
# ---------------------------------------------------------------------------

@router.get("/callback", summary="Handle Google OAuth callback")
async def callback(
    code: Optional[str] = None,
    state: Optional[str] = None,
    error: Optional[str] = None,
    error_description: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Handles the redirect back from Google after the user authenticates.
    Exchanges the authorization code for tokens, validates the ID token,
    upserts the user in the DB, and issues an application JWT cookie.
    """
    frontend_url = getattr(settings, "frontend_url", "http://localhost:3000")

    # ---- Handle provider errors ------------------------------------------
    if error:
        logger.warning("OAuth provider returned error: %s – %s", error, error_description)
        return RedirectResponse(
            url=f"{frontend_url}/login?error={error}",
            status_code=status.HTTP_302_FOUND,
        )

    if not code or not state:
        logger.warning("Callback missing code or state parameters")
        return RedirectResponse(
            url=f"{frontend_url}/login?error=missing_params",
            status_code=status.HTTP_302_FOUND,
        )

    # ---- Validate state ---------------------------------------------------
    auth_service = AuthService(db)
    state_data = await auth_service.get_and_delete_oidc_state(state)

    if not state_data:
        logger.warning("OIDC state validation failed – unknown or expired state: %s", state)
        return RedirectResponse(
            url=f"{frontend_url}/login?error=invalid_state",
            status_code=status.HTTP_302_FOUND,
        )

    nonce = state_data["nonce"]
    code_verifier = state_data["code_verifier"]

    # ---- Exchange code for tokens ----------------------------------------
    try:
        token_endpoint = "https://oauth2.googleapis.com/token"
        redirect_uri = f"{settings.backend_url}/api/v1/auth/callback"

        async with httpx.AsyncClient(timeout=30.0) as client:
            token_response = await client.post(
                token_endpoint,
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "client_id": settings.oidc_client_id,
                    "client_secret": settings.oidc_client_secret,
                    "code_verifier": code_verifier,
                },
            )
            token_response.raise_for_status()
            token_data = token_response.json()

    except httpx.HTTPStatusError as exc:
        logger.error("Token exchange HTTP error %s: %s", exc.response.status_code, exc.response.text)
        return RedirectResponse(
            url=f"{frontend_url}/login?error=token_exchange_failed",
            status_code=status.HTTP_302_FOUND,
        )
    except Exception as exc:
        logger.error("Token exchange failed: %s", exc)
        return RedirectResponse(
            url=f"{frontend_url}/login?error=token_exchange_failed",
            status_code=status.HTTP_302_FOUND,
        )

    id_token = token_data.get("id_token")
    if not id_token:
        logger.error("No id_token in token response")
        return RedirectResponse(
            url=f"{frontend_url}/login?error=no_id_token",
            status_code=status.HTTP_302_FOUND,
        )

    # ---- Validate ID token -----------------------------------------------
    try:
        claims = await validate_id_token(id_token)
    except IDTokenValidationError as exc:
        logger.error("ID token validation failed: %s (%s)", exc.message, exc.error_type)
        return RedirectResponse(
            url=f"{frontend_url}/login?error=token_validation_failed",
            status_code=status.HTTP_302_FOUND,
        )

    # ---- Upsert user & issue app token ------------------------------------
    platform_sub = claims.get("sub")
    email = claims.get("email", "")
    name = claims.get("name")

    user = await auth_service.get_or_create_user(platform_sub, email, name)
    app_token, expires_at, _ = await auth_service.issue_app_token(user)

    logger.info("User %s authenticated via Google OIDC", platform_sub[:8] if platform_sub else "?")

    # ---- Return token cookie and redirect to frontend ---------------------
    redirect_response = RedirectResponse(
        url=f"{frontend_url}/dashboard",
        status_code=status.HTTP_302_FOUND,
    )
    _set_token_cookie(redirect_response, app_token)
    return redirect_response


# ---------------------------------------------------------------------------
# Email / password login
# ---------------------------------------------------------------------------

@router.post("/login", summary="Login with email and password", response_model=TokenResponse)
async def login_with_password(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticates a user with email + password (bcrypt hash).
    Returns a JWT both in the response body and as an HttpOnly cookie.

    Note: passwords are stored as bcrypt hashes in the `users.password_hash` column.
    If the user was created via Google OIDC they won't have a password – use /login (GET).
    """
    from models.auth import User
    from sqlalchemy import select

    try:
        import bcrypt
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Password authentication requires the 'bcrypt' package. Install it with: pip install bcrypt",
        )

    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    # Generic error to avoid user enumeration
    invalid_credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
    )

    if not user:
        logger.warning("Login attempt for unknown email (hash: %s)", hash(body.email))
        raise invalid_credentials_exc

    password_hash = getattr(user, "password_hash", None)
    if not password_hash:
        # User exists but only has OIDC login – no local password set
        logger.warning("Email/password login attempt for OIDC-only account: %s", user.id[:8])
        raise invalid_credentials_exc

    if not bcrypt.checkpw(body.password.encode(), password_hash.encode()):
        logger.warning("Bad password for user %s", user.id[:8])
        raise invalid_credentials_exc

    auth_service = AuthService(db)
    app_token, expires_at, _ = await auth_service.issue_app_token(user)

    _set_token_cookie(response, app_token)

    return TokenResponse(
        access_token=app_token,
        token_type="bearer",
        expires_at=expires_at.isoformat(),
    )


# ---------------------------------------------------------------------------
# Current user
# ---------------------------------------------------------------------------

@router.get("/me", summary="Get currently authenticated user")
async def get_me(current_user=Depends(get_current_user)):
    """Returns the JWT claims of the currently authenticated user."""
    return {
        "id": current_user.get("sub"),
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "role": current_user.get("role"),
        "last_login": current_user.get("last_login"),
    }


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------

@router.post("/logout", summary="Logout – clears the session cookie")
async def logout(response: Response):
    """Clears the access_token cookie. Token is stateless so server-side invalidation is not required."""
    _clear_token_cookie(response)
    return {"detail": "Logged out successfully"}
