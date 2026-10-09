from fastapi import FastAPI
from app.orders.router import router as order_router
from app.auth.router import router as auth_router

from app.cart.router import router as cart_router

from app.products.router import router as product_router


app = FastAPI(title="Vendly", version="0.1.0")

app.include_router(auth_router, prefix="/auth" , tags=["auth"])

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://vendly-frontend-lk6e.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "okk"}

app.include_router(product_router, prefix="/products", tags=["products"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])
app.include_router(order_router, prefix="/orders", tags=["orders"])
