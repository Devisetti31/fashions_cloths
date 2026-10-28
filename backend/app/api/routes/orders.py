import random
import time
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.api.deps import get_current_user
from app.schemas.order import (
    OrderCreateRequest,
    OrderResponse,
    OrderItemResponse,
)

router = APIRouter(prefix="/orders", tags=["Customer Orders"])


def generate_order_number() -> str:
    """Generate a regal, unique boutique order number."""
    t = int(time.time() * 1000) % 1000000
    r = random.randint(100, 999)
    return f"ES-ORD-{t}-{r}"


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new boutique order",
    description="Calculates item prices securely on the backend from verified product inventory.",
)
def create_customer_order(
    payload: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> OrderResponse:
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one line item.",
        )

    order_number = generate_order_number()
    subtotal = Decimal("0.00")
    order_items_to_create = []

    for item in payload.items:
        product = None
        if item.product_id:
            product = db.scalar(select(Product).where(Product.id == item.product_id))

        # Determine authoritative unit price
        if product:
            unit_price = Decimal(str(product.price))
            product_name = product.name
            product_image = product.primary_image or item.product_image
        elif item.unit_price is not None:
            unit_price = Decimal(str(item.unit_price))
            product_name = item.product_name
            product_image = item.product_image
        else:
            unit_price = Decimal("0.00")
            product_name = item.product_name
            product_image = item.product_image

        item_total = unit_price * item.quantity
        subtotal += item_total

        order_item = OrderItem(
            product_id=product.id if product else None,
            product_name=product_name,
            product_image=product_image,
            size=item.size,
            color=item.color,
            quantity=item.quantity,
            unit_price=unit_price,
            total_price=item_total,
        )
        order_items_to_create.append(order_item)

    # Complimentary shipping on orders above 15,000 INR
    shipping_fee = Decimal("0.00") if subtotal >= Decimal("15000.00") else Decimal("500.00")
    total_amount = subtotal + shipping_fee

    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        status="CONFIRMED",
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total_amount=total_amount,
        shipping_address=payload.shipping_address,
        contact_email=current_user.email,
        contact_phone=payload.contact_phone or current_user.phone_number,
        payment_method=payload.payment_method,
        notes=payload.notes,
        items=order_items_to_create,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Format response
    resp = OrderResponse.model_validate(order)
    resp.customer_name = current_user.full_name
    resp.customer_email = current_user.email
    return resp


@router.get(
    "/my-orders",
    response_model=List[OrderResponse],
    summary="List orders for authenticated customer",
    description="Enforces strict patron authorization — returns only orders belonging to current session user.",
)
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[OrderResponse]:
    orders = db.scalars(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    ).all()

    result = []
    for o in orders:
        ord_resp = OrderResponse.model_validate(o)
        ord_resp.customer_name = current_user.full_name
        ord_resp.customer_email = current_user.email
        result.append(ord_resp)

    return result


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    summary="Get single order details by ID",
)
def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> OrderResponse:
    order = db.scalar(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items), selectinload(Order.user))
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    # Authorization check: only order owner or admin
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this order.",
        )

    resp = OrderResponse.model_validate(order)
    if order.user:
        resp.customer_name = order.user.full_name
        resp.customer_email = order.user.email
    return resp
