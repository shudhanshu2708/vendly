# Vendly 🛒

Vendly is a full-stack e-commerce application built with **FastAPI, PostgreSQL, Redis, and React**.

## Features

- JWT Authentication with Access & Refresh Tokens
- Customer and Admin roles
- Product and Category Management
- Shopping Cart
- Stock Management
- Checkout and Orders
- Admin Order Management
- Order Status Updates
- Redis-based Refresh Token Management
- PostgreSQL Database
- Alembic Database Migrations
- Docker & Docker Compose
- React Frontend

## Tech Stack

**Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Alembic, JWT

**Frontend:** React, JavaScript, React Router, Vite, CSS

**Tools:** Docker, Git, GitHub

## Project Structure

```text
Vendly/
├── app/
│   ├── auth/
│   ├── cart/
│   ├── models/
│   ├── orders/
│   ├── products/
│   ├── schemas/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   └── redis_client.py
├── alembic/
├── vendly-frontend/
├── docker-compose.yml
├── requirements.txt
├── seed.py
└── README.md
## Setup

### Backend

```bash
git clone https://github.com/shudhanshu2708/Vendly.git
cd Vendly

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

## API Endpoints

### Authentication

```text
POST /auth/signup
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
POST /auth/change-password

### Products
'''text
GET    /products/
GET    /products/{id}
POST   /products/
PUT    /products/{id}
DELETE /products/{id}

### Cart

```text
GET    /cart/
POST   /cart/
PUT    /cart/{item_id}
DELETE /cart/{item_id}
DELETE /cart/

### Orders

```text
POST /orders/checkout
GET  /orders/
GET  /orders/{order_id}
GET  /orders/admin/all
PUT  /orders/admin/{order_id}/status

Login → Browse Products → Add to Cart → Checkout
→ Stock Validation → Create Order → Decrease Stock → View Order

### Admin

```tex
Admin can:
- Add products
- Update products
- Deactivate products
- View customer orders
- Update order status

Future Improvements
- Payment Gateway
- Product Search & Filtering
- Reviews & Ratings
- Image Upload
- Email Notifications
- Pagination
- Automated Tests
- CI/CD
- Cloud Deployment

Author
Sudhanshu Singh
GitHub: https://github.com/shudhanshu2708/Vendly

## License

This project is licensed under the MIT License.
