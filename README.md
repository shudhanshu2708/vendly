# Vendly 🛒

Vendly is a full-stack e-commerce application built with **FastAPI, PostgreSQL, Redis, and React**.

## ✨ Features

- JWT authentication with access and refresh tokens
- Customer and Admin roles
- Product and category management
- Shopping cart
- Stock management
- Checkout and orders
- Admin order management and order status updates
- Redis-based refresh token management
- PostgreSQL database with Alembic migrations
- Docker and Docker Compose support
- React frontend

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Alembic, JWT |
| **Frontend** | React, JavaScript, React Router, Vite, CSS |
| **Tools** | Docker, Git, GitHub |

## 📁 Project Structure

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
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL and Redis (or Docker)

### Backend

```bash
git clone https://github.com/shudhanshu2708/Vendly.git
cd Vendly

# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# (Optional) Seed sample data
python seed.py

# Start the API server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd vendly-frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## 📡 API Endpoints

### Authentication

```text
POST /auth/signup
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
POST /auth/change-password
```

### Products

```text
GET    /products/
GET    /products/{id}
POST   /products/
PUT    /products/{id}
DELETE /products/{id}
```

### Cart

```text
GET    /cart/
POST   /cart/
PUT    /cart/{item_id}
DELETE /cart/{item_id}
DELETE /cart/
```

### Orders

```text
POST /orders/checkout
GET  /orders/
GET  /orders/{order_id}
GET  /orders/admin/all
PUT  /orders/admin/{order_id}/status
```

## 🔄 Order Flow

```text
Login → Browse Products → Add to Cart → Checkout
→ Stock Validation → Create Order → Decrease Stock → View Order
```

## 👤 Admin Capabilities

Admins can:

- Add products
- Update products
- Deactivate products
- View customer orders
- Update order status

## 🔮 Future Improvements

- [ ] Payment gateway
- [ ] Product search and filtering
- [ ] Reviews and ratings
- [ ] Image upload
- [ ] Email notifications
- [ ] Pagination
- [ ] Automated tests
- [ ] CI/CD
- [ ] Cloud deployment

## 👨‍💻 Author

**Sudhanshu Singh**
GitHub: [@shudhanshu2708](https://github.com/shudhanshu2708)

## 📄 License

This project is licensed under the MIT License.
