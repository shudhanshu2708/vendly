from fastapi import FastAPI
from app.database import Base , engine
from app.models.user import User
from app.models.order import Order, OrderItem
from app.orders.router import router as order_router
from app.auth.router import router as auth_router
from app.config import settings
from app.models.cart import CartItem
from app.cart.router import router as cart_router
from app.models.category import Category
from app.models.product import Product
from app.products.router import router as product_router


app = FastAPI(title="Vendly", version="0.1.0")

app.include_router(auth_router, prefix="/auth" , tags=["auth"])

@app.get("/health")
def health_check():
    return {"status": "okk"}

app.include_router(product_router, prefix="/products", tags=["products"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])
app.include_router(order_router, prefix="/orders", tags=["orders"])