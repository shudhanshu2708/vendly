# Vendly

A production-grade e-commerce backend built with FastAPI, PostgreSQL, and Redis — focused on demonstrating real-world backend engineering practices around authentication, security, and clean API design.

> **Status:** Auth, products, cart, and orders/checkout modules are all functional. Payments and deployment are still in progress.

## Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL (via SQLAlchemy ORM)
- **Cache / Token Store:** Redis (used for refresh token rotation)
- **Auth:** JWT (access + refresh tokens) via `python-jose`
- **Password Hashing:** `bcrypt` (direct, not via `passlib` — see Notes)
- **Config Management:** `pydantic-settings`
- **Containerization:** Docker (Postgres + Redis run as containers locally)

## Features Implemented

### Auth Module

| Route | Method | Status | Description |
|---|---|---|---|
| `/auth/signup` | POST | ✅ Done | Registers a new user, hashes password with bcrypt, returns access + refresh tokens |
| `/auth/login` | POST | ✅ Done | Verifies credentials, returns access + refresh tokens |
| `/auth/refresh` | POST | ✅ Done | Verifies refresh token against Redis, **rotates** it (old token is invalidated), returns a new access + refresh token pair |
| `/auth/logout` | POST | ✅ Done | Revokes the given refresh token from Redis |
| `/auth/me` | GET | ✅ Done | Returns current authenticated user's info (protected route) |
| `/auth/change-password` | POST | ✅ Done | Verifies old password, then updates to a new hashed password (protected route) |
| `/auth/logout-all` | POST | ✅ Done | Revokes all active refresh tokens for the current user (protected route) |

### Products Module

| Route | Method | Access | Description |
|---|---|---|---|
| `/products/categories` | POST | Admin | Create a category |
| `/products/categories` | GET | Public | List all categories |
| `/products/` | POST | Admin | Create a product |
| `/products/` | GET | Public | List active products (paginated via `skip`/`limit`) |
| `/products/{product_id}` | GET | Public | Get a single product |
| `/products/{product_id}` | PUT | Admin | Update a product (partial update) |
| `/products/{product_id}` | DELETE | Admin | Soft-delete — sets `is_active = False` rather than removing the row |

### Cart Module

| Route | Method | Description |
|---|---|---|
| `/cart/` | GET | Get the current user's cart |
| `/cart/` | POST | Add a product to the cart; increments quantity if the item is already present |
| `/cart/{item_id}` | PUT | Update quantity of a cart item |
| `/cart/{item_id}` | DELETE | Remove a single item from the cart |
| `/cart/` | DELETE | Clear the entire cart |

All cart routes are scoped to the authenticated user (`get_current_user`) and validate against live product stock/active status on add.

> Note: the cart is currently **PostgreSQL-backed** (a `CartItem` table), not Redis-backed as originally planned.

### Orders Module

| Route | Method | Access | Description |
|---|---|---|---|
| `/orders/checkout` | POST | User | Validates stock for every cart item, then atomically creates the order + order items, decrements product stock, and clears the cart. Rolls back entirely on failure. |
| `/orders/` | GET | User | List the current user's orders |
| `/orders/{order_id}` | GET | User | Get a single order (scoped to the requesting user) |
| `/orders/admin/all` | GET | Admin | List all orders across all users |
| `/orders/admin/{order_id}/status` | PUT | Admin | Update an order's status |

Checkout does a stock-availability pass across all cart items **before** writing anything, so a failed item can't leave a partial order behind.

### Security Design Choices

- **Password hashing:** Passwords are hashed with `bcrypt` before storage — never stored in plain text.
- **JWT access tokens:** Short-lived (15 min default), stateless, signed with a secret key.
- **Refresh token rotation:** Refresh tokens are random, cryptographically secure strings (`secrets.token_urlsafe`) stored in Redis with an expiry (7 days default). Each refresh token can be used **exactly once** — using it issues a new refresh token and immediately invalidates the old one. This limits the damage if a refresh token is ever leaked.
- **Role-based structure:** `User` model includes a `role` field (`customer` / `admin`) via a Python enum, enforced at the DB level. Admin-only routes are protected with a `require_admin` dependency.

## Project Structure

```
vendly/
├── app/
│   ├── main.py                 # App entrypoint, router mounting, table creation
│   ├── config.py               # Environment-based settings (pydantic-settings)
│   ├── database.py              # SQLAlchemy engine, session, Base
│   ├── redis_client.py         # Redis connection client
│   ├── models/
│   │   ├── user.py             # User table definition
│   │   ├── product.py          # Product table
│   │   ├── category.py         # Category table
│   │   ├── cart.py             # CartItem table
│   │   └── order.py            # Order, OrderItem tables
│   ├── schemas/
│   │   ├── auth.py             # Pydantic request/response schemas for auth
│   │   ├── product.py          # Product/Category schemas
│   │   ├── cart.py             # Cart schemas
│   │   └── order.py            # Order schemas
│   ├── auth/
│   │   ├── security.py         # Password hashing, JWT creation, refresh token storage
│   │   ├── dependencies.py     # get_current_user, require_admin
│   │   └── router.py           # Auth route handlers
│   ├── products/
│   │   └── router.py           # Product & category route handlers
│   ├── cart/
│   │   └── router.py           # Cart route handlers
│   └── orders/
│       └── router.py           # Checkout & order route handlers
├── alembic/                     # DB migrations
├── requirements.txt
├── docker-compose.yml
├── alembic.ini
├── .env.example
└── .gitignore
```

## Setup

### Prerequisites
- Python 3.13
- Docker Desktop (for Postgres + Redis containers)

### 1. Clone and set up virtual environment
```bash
git clone <repo-url>
cd vendly
python -m venv .venv
.venv\Scripts\Activate.ps1      # Windows PowerShell
```

### 2. Install dependencies
```bash
python -m pip install -r requirements.txt
```

### 3. Start Postgres and Redis (Docker)
```bash
docker run --name vendly-postgres -e POSTGRES_USER=vendly_user -e POSTGRES_PASSWORD=vendly_pass -e POSTGRES_DB=vendly -p 5433:5432 -d postgres

docker run --name vendly-redis -p 6380:6379 -d redis
```

### 4. Configure environment variables
Copy `.env.example` to `.env` and fill in real values:
```
DATABASE_URL=postgresql://vendly_user:vendly_pass@localhost:5433/vendly
JWT_SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6380/0
```

### 5. Run the server
```bash
python -m uvicorn app.main:app --reload
```

API docs available at: `http://127.0.0.1:8000/docs`

### Alternative: Docker Compose

A `docker-compose.yml` is included for Postgres + Redis:

```bash
docker compose up -d
```

This uses the **default ports** (`5432` for Postgres, `6379` for Redis) with a persistent volume for Postgres data. Note this differs from the manual `docker run` commands above, which map to `5433`/`6380` — make sure your `.env` matches whichever setup you're actually running.

## Notes / Known Gotchas

- **`passlib` was dropped** in favor of calling `bcrypt` directly, due to a compatibility bug between `passlib`'s bcrypt backend detection and newer `bcrypt` (4.1+) releases.
- Docker containers do **not** auto-restart after a system reboot by default. Run `docker start vendly-postgres vendly-redis` (or set a restart policy) after restarting your machine.
- Always activate the virtual environment before installing packages or running the server — mixing a global Python install with the project's venv is a common source of `ModuleNotFoundError`.
- Checkout re-validates stock at commit time and rolls back the whole transaction on any failure, so partial orders shouldn't occur even under concurrent checkouts on the same product — though this hasn't been load-tested yet.

## Roadmap

- [ ] Mock payment flow with idempotency handling
- [ ] Order status transition validation (e.g. prevent invalid state jumps)
- [x] `docker-compose.yml` for Postgres + Redis
- [ ] Deploy (Railway / Render)
