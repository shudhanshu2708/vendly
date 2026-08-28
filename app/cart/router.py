from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemOut
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=list[CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(CartItem).filter(CartItem.user_id == current_user.id).all()

@router.post("/", response_model=CartItemOut)
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id, CartItem.product_id == data.product_id
    ).first()

    if item:
        item.quantity += data.quantity
    else:
        item = CartItem(user_id=current_user.id, product_id=data.product_id, quantity=data.quantity)
        db.add(item)

    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, data: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")
    item.quantity = data.quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}