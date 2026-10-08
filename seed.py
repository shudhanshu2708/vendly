from app.database import SessionLocal
from app.models.product import Product
from app.models.category import Category


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
    for product_data in products:
        product = Product(**product_data)
        db.add(product)

    db.commit()
    print("Products added successfully!")

except Exception as error:
    db.rollback()
    print("Error:", error)

finally:
    db.close()