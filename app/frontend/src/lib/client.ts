import { getAPIBaseURL } from './config';

const TOKEN_KEY = 'keepstore_auth_token';
const EXPIRES_KEY = 'keepstore_auth_expires';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string, expiresAt?: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresAt) {
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  }
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

function buildQueryString(params: {
  query?: Record<string, unknown>;
  sort?: string;
  limit?: number;
}): string {
  const searchParams = new URLSearchParams();
  if (params.query) {
    searchParams.set('query', JSON.stringify(params.query));
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

interface EntityQueryParams {
  query?: Record<string, unknown>;
  sort?: string;
  limit?: number;
}

interface EntityCreateParams {
  data: Record<string, unknown>;
}

interface EntityUpdateParams {
  id: string | number;
  data: Record<string, unknown>;
}

interface EntityDeleteParams {
  id: string | number;
}

interface EntityHandler {
  query(params?: EntityQueryParams): Promise<{ data: { items: unknown[] } }>;
  queryAll(params?: EntityQueryParams): Promise<{ data: { items: unknown[] } }>;
  create(params: EntityCreateParams): Promise<{ data: unknown }>;
  update(params: EntityUpdateParams): Promise<{ data: unknown }>;
  delete(params: EntityDeleteParams): Promise<{ data: { message: string; id: string | number } }>;
}

function createEntityHandler(name: string): EntityHandler {
  return {
    async query(params: EntityQueryParams = {}) {
      const apiBase = getAPIBaseURL();
      const qs = buildQueryString(params);
      const response = await fetch(`${apiBase}/api/v1/entities/${name}${qs}`, {
        headers: { ...getAuthHeaders() },
      });
      if (!response.ok) {
        throw new Error(`Entity query failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data: data.data ?? data };
    },

    async queryAll(params: EntityQueryParams = {}) {
      const apiBase = getAPIBaseURL();
      const qs = buildQueryString(params);
      const response = await fetch(`${apiBase}/api/v1/entities/${name}/all${qs}`, {
        headers: { ...getAuthHeaders() },
      });
      if (!response.ok) {
        throw new Error(`Entity queryAll failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data: data.data ?? data };
    },

    async create(params: EntityCreateParams) {
      const apiBase = getAPIBaseURL();
      const response = await fetch(`${apiBase}/api/v1/entities/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(params.data),
      });
      if (!response.ok) {
        throw new Error(`Entity create failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data: data.data ?? data };
    },

    async update(params: EntityUpdateParams) {
      const apiBase = getAPIBaseURL();
      const response = await fetch(`${apiBase}/api/v1/entities/${name}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(params.data),
      });
      if (!response.ok) {
        throw new Error(`Entity update failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data: data.data ?? data };
    },

    async delete(params: EntityDeleteParams) {
      const apiBase = getAPIBaseURL();
      const response = await fetch(`${apiBase}/api/v1/entities/${name}/${params.id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      if (!response.ok) {
        throw new Error(`Entity delete failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data: data.data ?? data };
    },
  };
}

interface AuthClient {
  me(): Promise<{ data: unknown | null }>;
  toLogin(): void;
  login(): { data: { token: string | null } };
  logout(): Promise<{ data: { redirect_url?: string } }>;
}

interface Client {
  auth: AuthClient;
  entities: Record<string, EntityHandler>;
}

export function createClient(): Client {
  const auth: AuthClient = {
    async me() {
      const apiBase = getAPIBaseURL();
      const token = getToken();
      if (!token) {
        return { data: null };
      }
      try {
        const response = await fetch(`${apiBase}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            clearToken();
            return { data: null };
          }
          throw new Error(`Auth me failed: ${response.status}`);
        }
        const data = await response.json();
        return { data: data.data ?? data };
      } catch {
        return { data: null };
      }
    },

    toLogin() {
      const apiBase = getAPIBaseURL();
      window.location.href = `${apiBase}/api/v1/auth/login`;
    },

    login() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const expiresAt = params.get('expires_at');
      if (token) {
        setToken(token, expiresAt ?? undefined);
      }
      return { data: { token } };
    },

    async logout() {
      const apiBase = getAPIBaseURL();
      try {
        const response = await fetch(`${apiBase}/api/v1/auth/logout`, {
          headers: { ...getAuthHeaders() },
        });
        clearToken();
        if (response.ok) {
          const data = await response.json();
          return { data: data.data ?? data };
        }
        return { data: {} };
      } catch {
        clearToken();
        return { data: {} };
      }
    },
  };

  const entitiesProxy = new Proxy({} as Record<string, EntityHandler>, {
    get(_target, prop: string) {
      return createEntityHandler(prop);
    },
  });

  return {
    auth,
    entities: entitiesProxy,
  };
}