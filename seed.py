from app.database import SessionLocal
from app.models.category import Category
from app.models.product import Product
from app.models.user import User
from app.models.cart import CartItem
from app.models.order import Order

products = [
    {
        "name": "Wireless Headphones",
        "description": "Comfortable wireless headphones with clear sound.",
        "price": 2499,
        "stock": 20,
    },
    {
        "name": "Mechanical Keyboard",
        "description": "Mechanical keyboard for gaming and productivity.",
        "price": 3499,
        "stock": 15,
    },
    {
        "name": "Smart Watch",
        "description": "Smart watch with fitness and notification features.",
        "price": 1999,
        "stock": 25,
    },
    {
        "name": "USB-C Hub",
        "description": "USB-C hub with multiple ports for laptops.",
        "price": 1299,
        "stock": 30,
    },
    {
        "name": "Laptop Stand",
        "description": "Adjustable stand for better laptop ergonomics.",
        "price": 899,
        "stock": 20,
    },
    {
        "name": "Wireless Mouse",
        "description": "Lightweight wireless mouse for everyday use.",
        "price": 799,
        "stock": 35,
    },
]

db = SessionLocal()

try:
    added = 0
    skipped = 0

    for data in products:
        existing = (
            db.query(Product)
            .filter(Product.name == data["name"])
            .first()
        )

        if existing:
            skipped += 1
            continue

        db.add(Product(**data))
        added += 1

    db.commit()
    print(f"Added: {added}, Already existed: {skipped}")

except Exception as error:
    db.rollback()
    print("Error:", error)
    raise

finally:
    db.close()

