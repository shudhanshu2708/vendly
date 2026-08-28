from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name: str
    slug: str
    parent_id: Optional[int] = None

class CategoryOut(CategoryCreate):
    id: int
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None

class ProductOut(ProductCreate):
    id: int
    is_active: bool
    class Config:
        from_attributes = True