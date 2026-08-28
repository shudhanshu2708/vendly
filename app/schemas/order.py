from pydantic import BaseModel
from datetime import datetime

from app.models.order import OrderStatus

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]
    class Config:
        from_attributes = True