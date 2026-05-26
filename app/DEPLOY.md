# Keep Store - Guia de Deploy

## Visão Geral

Este projeto é composto por:
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python) com PostgreSQL + OIDC Authentication
- **Banco de Dados**: PostgreSQL 15

---

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ e pnpm (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local do backend)
- PostgreSQL 15+ (para desenvolvimento local sem Docker)
- Um provedor OIDC configurado (Auth0, Keycloak, Google, etc.)

---

## Deploy com Docker (Recomendado)

### 1. Clone o repositório e entre na pasta do projeto

```bash
cd app/
```

### 2. Configure as variáveis de ambiente

```bash
# Copie os arquivos de exemplo
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edite os arquivos `.env` conforme descrito na seção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo.

Para o Docker Compose, crie um arquivo `.env` na raiz do projeto (`app/.env`) com as variáveis que serão injetadas nos containers:

```bash
# app/.env (usado pelo docker-compose.yml)
POSTGRES_PASSWORD=sua-senha-segura
JWT_SECRET_KEY=gere-uma-chave-aleatoria-forte
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
OIDC_ISSUER_URL=https://seu-provedor-oidc.example.com
OIDC_CLIENT_ID=seu-client-id
OIDC_CLIENT_SECRET=seu-client-secret
OIDC_SCOPE=openid profile email
ADMIN_USER_ID=uuid-do-admin
ADMIN_USER_EMAIL=admin@seudominio.com
FRONTEND_URL=http://localhost
CORS_ORIGINS=http://localhost,http://localhost:3000
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=
```

### 3. Inicie os serviços

```bash
docker compose up -d --build
```

### 4. Acesse a aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs

### 5. Parar os serviços

```bash
docker compose down
```

### 6. Parar e remover dados

```bash
docker compose down -v
```

---

## Desenvolvimento Local

### Frontend

```bash
cd frontend/

# Instale dependências
pnpm install

# Copie e configure variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm run dev
```

O frontend estará disponível em http://localhost:3000

### Backend

```bash
cd backend/

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Instale dependências
pip install -r requirements.txt

# Copie e configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações (veja seção abaixo)

# Inicie o servidor
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

O backend estará disponível em http://localhost:8000

---

## Deploy em Produção

### Opção 1: VPS (DigitalOcean, AWS EC2, etc.)

1. Provisione um servidor com Docker instalado
2. Clone o repositório no servidor
3. Configure as variáveis de ambiente para produção (veja seção abaixo)
4. Execute `docker compose up -d --build`
5. Configure um reverse proxy (Nginx/Caddy) com SSL

### Opção 2: Serviços separados

**Frontend** (Vercel, Netlify, Cloudflare Pages):
```bash
cd frontend/
pnpm run build
# Faça deploy da pasta dist/
```

**Backend** (Railway, Render, Fly.io):
```bash
cd backend/
# Configure todas as variáveis de ambiente listadas abaixo
# Deploy com o Dockerfile.backend
```

**Banco de Dados** (Supabase, Neon, AWS RDS):
- Crie uma instância PostgreSQL
- Atualize `DATABASE_URL` no backend

---

## Estrutura do Projeto

```
app/
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e cliente API
│   │   ├── contexts/      # React Contexts (Cart, etc.)
│   │   └── data/          # Dados estáticos
│   ├── public/            # Assets estáticos
│   └── .env.example       # Variáveis de ambiente
├── backend/               # API FastAPI
│   ├── main.py            # Entrada da aplicação
│   ├── core/              # Configuração, auth, database
│   ├── routers/           # Endpoints da API
│   ├── services/          # Lógica de negócio
│   ├── models/            # Modelos SQLAlchemy
│   ├── requirements.txt   # Dependências Python
│   └── .env.example       # Variáveis de ambiente
├── docker-compose.yml     # Orquestração Docker
├── Dockerfile.frontend    # Build do frontend
├── Dockerfile.backend     # Build do backend
├── nginx.conf             # Configuração Nginx
└── DEPLOY.md              # Este arquivo
```

---

## Variáveis de Ambiente

### Frontend (`frontend/.env`)

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `VITE_API_BASE_URL` | URL base da API backend | Não | `http://localhost:8000` |
| `VITE_APP_TITLE` | Título da aplicação | Não | `Keep Store` |
| `VITE_APP_DESCRIPTION` | Descrição da aplicação | Não | `Loja de eletrônicos e acessórios de tecnologia` |

### Backend (`backend/.env`)

#### Database

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `DATABASE_URL` | URL de conexão PostgreSQL (usar driver `asyncpg`) | **Sim** | - |

Exemplo: `postgresql+asyncpg://postgres:postgres@localhost:5432/keepstore`

#### Server

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `HOST` | Host do servidor | Não | `0.0.0.0` |
| `PORT` | Porta do servidor | Não | `8000` |

#### JWT (Tokens da Aplicação)

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `JWT_SECRET_KEY` | Chave secreta para assinar tokens JWT da aplicação. Gere com `openssl rand -hex 32` | **Sim** | - |
| `JWT_ALGORITHM` | Algoritmo de assinatura JWT | Não | `HS256` |
| `JWT_EXPIRE_MINUTES` | Tempo de expiração do token em minutos | Não | `1440` (24h) |

#### OIDC (OpenID Connect)

O backend usa OIDC para autenticação. Você precisa de um provedor OIDC (Auth0, Keycloak, Google, etc.).

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `OIDC_ISSUER_URL` | URL do provedor OIDC (ex: `https://seu-tenant.auth0.com`) | **Sim** | - |
| `OIDC_CLIENT_ID` | Client ID registrado no provedor OIDC | **Sim** | - |
| `OIDC_CLIENT_SECRET` | Client Secret registrado no provedor OIDC | **Sim** | - |
| `OIDC_SCOPE` | Escopos OIDC solicitados (separados por espaço) | Não | `openid profile email` |

**Configuração do provedor OIDC:**
1. Crie uma aplicação no seu provedor OIDC
2. Configure a Callback URL: `https://seu-dominio.com/api/v1/auth/callback`
3. Configure a Logout URL: `https://seu-dominio.com/logout-callback`
4. Copie o Client ID e Client Secret para as variáveis acima

#### Admin

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `ADMIN_USER_ID` | UUID do usuário admin (será promovido a admin no startup) | **Sim** | - |
| `ADMIN_USER_EMAIL` | Email do usuário admin | **Sim** | - |

**Nota:** O usuário com este ID receberá automaticamente o papel "admin" ao iniciar o backend. Use o `sub` (subject) do seu provedor OIDC como ID.

#### Frontend & CORS

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `FRONTEND_URL` | URL onde o frontend está hospedado (usado para redirect de logout) | **Sim** | - |
| `CORS_ORIGINS` | Origens permitidas para CORS (separadas por vírgula) | Não | `http://localhost:3000` |

#### Pagamentos (Opcional)

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `MERCADO_PAGO_ACCESS_TOKEN` | Access Token do Mercado Pago | Não | - |
| `MERCADO_PAGO_PUBLIC_KEY` | Chave Pública do Mercado Pago | Não | - |

---

## Configuração OIDC - Guia Rápido

### Auth0

1. Crie uma conta em [auth0.com](https://auth0.com)
2. Crie uma nova Application (Regular Web Application)
3. Em Settings:
   - Allowed Callback URLs: `http://localhost:8000/api/v1/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000/logout-callback`
4. Copie:
   - Domain → `OIDC_ISSUER_URL` (ex: `https://seu-tenant.auth0.com`)
   - Client ID → `OIDC_CLIENT_ID`
   - Client Secret → `OIDC_CLIENT_SECRET`

### Keycloak

1. Crie um Realm e um Client
2. Configure:
   - Valid Redirect URIs: `http://localhost:8000/api/v1/auth/callback`
   - Valid Post Logout Redirect URIs: `http://localhost:3000/logout-callback`
3. Copie:
   - Issuer URL → `OIDC_ISSUER_URL` (ex: `https://keycloak.example.com/realms/myrealm`)
   - Client ID → `OIDC_CLIENT_ID`
   - Client Secret → `OIDC_CLIENT_SECRET`

---

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env` do backend (deve usar `postgresql+asyncpg://`)
- Com Docker: aguarde o healthcheck do serviço `db`

### Frontend não conecta ao backend
- Verifique se `VITE_API_BASE_URL` está correto
- Confirme que o backend está rodando na porta esperada
- Verifique as configurações de CORS no backend

### Erro de autenticação OIDC
- Verifique se `OIDC_ISSUER_URL` está correto e acessível
- Confirme que `OIDC_CLIENT_ID` e `OIDC_CLIENT_SECRET` estão corretos
- Verifique se a Callback URL está configurada no provedor OIDC
- Confirme que `JWT_SECRET_KEY` está definido

### Admin não tem acesso ao painel
- Verifique se `ADMIN_USER_ID` corresponde ao `sub` do seu usuário no provedor OIDC
- Reinicie o backend após configurar `ADMIN_USER_ID` e `ADMIN_USER_EMAIL`

### Erro de build do frontend
```bash
cd frontend/
pnpm run lint  # Verifique erros de linting
pnpm run build # Tente o build novamente
```