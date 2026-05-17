# 🎨 Artelli Artesanatos — E-commerce Fullstack

[![Backend CI](https://img.shields.io/badge/backend-passing-brightgreen)](./backend)
[![Frontend CI](https://img.shields.io/badge/frontend-passing-brightgreen)](./frontend)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](./docker-compose.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](./frontend)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)](./backend)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

Plataforma completa de e-commerce para artesanato personalizado sob encomenda, desenvolvida com FastAPI no backend e React + TypeScript no frontend, orquestrada com Docker Compose.

> **Para avaliadores técnicos:** execute `docker compose up -d` e acesse `http://localhost:5173`. A API com documentação interativa estará em `http://localhost:8000/docs`.

---

## 🎯 Contexto e Problema Resolvido

Artesãos que trabalham sob encomenda não se encaixam em plataformas de e-commerce tradicionais (Mercado Livre, Shopify) que exigem estoque pré-definido. Esta aplicação resolve isso ao:

- Expor um catálogo de produtos **sem gestão de estoque rígida**
- Permitir que o cliente monte um carrinho e feche o pedido diretamente **via WhatsApp** com mensagem pré-formatada
- Dar ao administrador controle completo do catálogo com autenticação separada

---

## 🛠️ Stack e Decisões Técnicas

| Tecnologia | Decisão | O que demonstra |
|---|---|---|
| **FastAPI** | Escolhido sobre Django/Flask pela performance assíncrona nativa e documentação OpenAPI automática | Conhecimento de arquitetura de APIs modernas |
| **React + TypeScript** | TS evita classes inteiras de bugs em runtime; estritamente tipado (zero `any` nos contextos) | Maturidade e qualidade de código frontend |
| **SQLAlchemy 2.0** | ORM maduro com suporte a queries assíncronas e migrations via Alembic | Domínio de camada de persistência |
| **JWT (python-jose)** | Stateless por design; escalável horizontalmente sem sessões compartilhadas | Conhecimento de segurança em APIs |
| **Context API** | Gerenciamento de estado proporcional à complexidade; Redux seria over-engineering aqui | Tomada de decisão técnica consciente |
| **Docker + Compose** | Ambiente 100% reproduzível; elimina "funciona na minha máquina" | Mentalidade DevOps |
| **Nginx** | Proxy reverso no frontend para SPA com roteamento correto em produção | Conhecimento de deploy real |

---

## 📐 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / HTTPS
         ┌─────────────▼─────────────┐
         │   Nginx (porta 80/443)    │  ← serve SPA + proxy /api
         └──────┬──────────┬─────────┘
                │          │ /api/*
    React SPA   │    ┌─────▼──────────────┐
    (Vite build)│    │  FastAPI (porta    │
                │    │  8000, Uvicorn)    │
                │    │  ┌─────────────┐  │
                │    │  │   Routers   │  │  ← /auth /products /users
                │    │  │   Services  │  │
                │    │  │   Schemas   │  │  ← Pydantic (validação)
                │    │  │   Models    │  │  ← SQLAlchemy ORM
                │    │  └──────┬──────┘  │
                │    └─────────┼─────────┘
                │              │
                │    ┌─────────▼──────────┐
                │    │  PostgreSQL 15     │  ← dados persistentes
                │    └────────────────────┘
                │
     ┌──────────▼──────────┐
     │  Contextos React    │
     │  AuthContext        │  ← estado de autenticação global
     │  CartContext        │  ← carrinho persistido (localStorage)
     │  ProductContext     │  ← cache local de produtos
     └─────────────────────┘
```

### Fluxo de autenticação
```
Login → POST /api/token → JWT (30min) → localStorage
                                              │
Toda requisição protegida ← Authorization: Bearer <token>
                                              │
                              FastAPI valida assinatura + expiração
                              Decodifica sub → busca User no DB
```

---

## 🔐 Segurança Implementada

- **Senhas** hasheadas com **bcrypt** (passlib) — nunca armazenadas em texto puro
- **JWT** com expiração configurável via variável de ambiente
- **Pydantic** valida e sanitiza todos os inputs antes de tocar o banco
- **SQLAlchemy ORM** previne SQL Injection por design (queries parametrizadas)
- **CORS** configurado explicitamente (origins, métodos e headers)
- **Rotas protegidas** no frontend (PrivateRoute com verificação de role admin)
- **Senhas e secrets** via variáveis de ambiente — nunca em código

---

## 🧪 Testes e Qualidade

```
backend/tests/
├── test_auth.py        # registro, login, token inválido, usuário inativo
├── test_products.py    # CRUD completo, permissões, 404s
└── test_users.py       # perfil, admin vs usuário comum

Rodar: cd backend && pytest --cov=app --cov-report=term-missing
```

- Banco de testes isolado (SQLite in-memory via `dependency_overrides`)
- Fixtures com `autouse=True` garantem estado limpo entre testes
- CI executa os testes automaticamente a cada push (GitHub Actions)

---

## 📈 O que aprendi com este projeto

**Técnico:**
- Diferença prática entre autenticação stateful (session) e stateless (JWT) — e quando usar cada um
- Como `dependency_overrides` do FastAPI torna testes de integração elegantes
- Por que Context API é suficiente para este escopo e Redux seria over-engineering
- Nginx como proxy reverso para SPA: a importância de `try_files $uri /index.html`
- Docker multi-stage para reduzir imagem final de ~1GB para ~200MB

**Processo:**
- Importância de tipar todas as interfaces antes de escrever componentes
- Separar a lógica de negócio em services (`productService`, `authService`) desacopla a UI da API
- Testes escritos junto com o código identificam falhas de design antes de virar dívida técnica

---

## 🚀 Como executar

### Com Docker (recomendado)
```bash
git clone https://github.com/seu-usuario/artelli-ecommerce
cd artelli-ecommerce

cp backend/.env.example backend/.env
# Edite backend/.env com suas configurações

docker compose up -d

# Acesse:
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

### Criar admin inicial
```bash
docker compose exec app python -c "
from app.database import SessionLocal
from app.crud import create_user
from app.schemas import UserCreate
db = SessionLocal()
create_user(db, UserCreate(email='admin@artelli.com', username='admin', password='SuaSenhaForte123'))
# Depois atualize is_admin=True no banco
"
```

### Desenvolvimento local
```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Estrutura do Projeto

```
artelli-ecommerce/
├── backend/
│   ├── app/
│   │   ├── routers/       # endpoints organizados por domínio
│   │   ├── models.py      # tabelas do banco (SQLAlchemy)
│   │   ├── schemas.py     # validação de dados (Pydantic)
│   │   ├── crud.py        # operações de banco isoladas
│   │   ├── auth.py        # JWT e hashing de senha
│   │   └── main.py        # aplicação FastAPI + middleware
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # UI organizada por feature
│   │   ├── contexts/      # estado global (Auth, Cart, Products)
│   │   ├── services/      # chamadas à API isoladas
│   │   ├── types/         # interfaces TypeScript centralizadas
│   │   └── utils/         # helpers reutilizáveis
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## 🔮 Próximos Passos (Roadmap)

- [ ] **Cache com Redis** — produtos mais acessados em memória
- [ ] **Dashboard admin** — métricas de visualizações e pedidos via WhatsApp
- [ ] **Testes E2E** com Cypress — fluxo completo de compra
- [ ] **CI/CD** com GitHub Actions — deploy automático no Render/Vercel
- [ ] **Paginação** na listagem de produtos
- [ ] **Upload de imagens** com armazenamento em S3/Cloudinary
