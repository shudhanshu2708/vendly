from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.auth.dependencies import get_current_user, require_admin
from app.schemas.order import OrderOut, OrderStatusUpdate


router = APIRouter()

@router.post("/checkout", response_model=OrderOut)
def checkout(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # stock check pehle, taaki partial order na bane
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} unavailable")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

    try:
        total = 0.0
        order = Order(user_id=current_user.id, total_amount=0)
        db.add(order)
        db.flush()  # order.id chahiye order_items ke liye, commit se pehle

        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            product.stock -= item.quantity
            line_total = product.price * item.quantity
            total += line_total

            db.add(OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price_at_purchase=product.price,
            ))

        order.total_amount = total
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        db.commit()
        db.refresh(order)
        return order
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Checkout failed, please try again")

@router.get("/", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == current_user.id).all()

@router.get("/admin/all", response_model=list[OrderOut])
def list_all_orders(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Order).all()

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order



@router.put("/admin/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = data.status
    db.commit()
    db.refresh(order)
    return order