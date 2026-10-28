from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func, desc

from app.db.session import get_db
from app.models.user import User
from app.models.product import Product, ProductVariant, ProductImage
from app.models.category import Category
from app.models.order import Order, OrderItem
from app.api.deps import get_current_active_admin
from app.schemas.order import (
    OrderResponse,
    OrderStatusUpdateRequest,
    AdminMetricsResponse,
)
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
)

router = APIRouter(prefix="/admin", tags=["Administrator Management"])


@router.get(
    "/metrics",
    response_model=AdminMetricsResponse,
    summary="Fetch real-time boutique store metrics",
    description="Calculates exact metrics directly from active SQLite database.",
)
def get_dashboard_metrics(
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
) -> AdminMetricsResponse:
    total_products = db.scalar(select(func.count(Product.id))) or 0
    total_orders = db.scalar(select(func.count(Order.id))) or 0
    
    # Exclude cancelled orders from revenue
    total_revenue = db.scalar(
        select(func.coalesce(func.sum(Order.total_amount), Decimal("0.00")))
        .where(Order.status != "CANCELLED")
    ) or Decimal("0.00")
    
    total_customers = db.scalar(
        select(func.count(User.id)).where(User.is_admin == False)  # noqa: E712
    ) or 0

    recent_orders_db = db.scalars(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.user))
        .order_by(desc(Order.created_at))
        .limit(6)
    ).all()

    recent_orders = []
    for ord_obj in recent_orders_db:
        resp = OrderResponse.model_validate(ord_obj)
        if ord_obj.user:
            resp.customer_name = ord_obj.user.full_name
            resp.customer_email = ord_obj.user.email
        recent_orders.append(resp)

    return AdminMetricsResponse(
        total_products=total_products,
        total_orders=total_orders,
        total_revenue=Decimal(str(total_revenue)),
        total_customers=total_customers,
        recent_orders=recent_orders,
    )


@router.get(
    "/orders",
    response_model=List[OrderResponse],
    summary="List all customer orders",
)
def get_all_orders(
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
) -> List[OrderResponse]:
    orders = db.scalars(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.user))
        .order_by(desc(Order.created_at))
    ).all()

    result = []
    for ord_obj in orders:
        resp = OrderResponse.model_validate(ord_obj)
        if ord_obj.user:
            resp.customer_name = ord_obj.user.full_name
            resp.customer_email = ord_obj.user.email
        result.append(resp)

    return result


@router.patch(
    "/orders/{order_id}/status",
    response_model=OrderResponse,
    summary="Update customer order status",
)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdateRequest,
    admin: User = Depends(get_current_active_admin),
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

    order.status = payload.status
    db.commit()
    db.refresh(order)

    resp = OrderResponse.model_validate(order)
    if order.user:
        resp.customer_name = order.user.full_name
        resp.customer_email = order.user.email
    return resp


@router.get(
    "/products",
    response_model=List[ProductResponse],
    summary="List all products including archived for management",
)
def get_admin_products(
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
) -> List[ProductResponse]:
    products = db.scalars(
        select(Product)
        .options(selectinload(Product.category), selectinload(Product.variants), selectinload(Product.images))
        .order_by(desc(Product.created_at))
    ).all()
    return [ProductResponse.model_validate(p) for p in products]


@router.post(
    "/products",
    response_model=ProductDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new boutique couture product",
)
def create_product(
    payload: ProductCreate,
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
) -> ProductDetailResponse:
    # Verify category exists
    cat = db.scalar(select(Category).where(Category.id == payload.category_id))
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID {payload.category_id} does not exist.",
        )

    # Check for slug conflict
    existing_slug = db.scalar(select(Product).where(Product.slug == payload.slug))
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with slug '{payload.slug}' already exists.",
        )

    # Check for SKU conflict
    existing_sku = db.scalar(select(Product).where(Product.sku == payload.sku))
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU '{payload.sku}' already exists.",
        )

    product = Product(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        price=payload.price,
        compare_at_price=payload.compare_at_price,
        sku=payload.sku,
        category_id=payload.category_id,
        primary_image=payload.primary_image,
        fabric=payload.fabric,
        craft=payload.craft,
        details=payload.details,
        is_active=payload.is_active,
        is_featured=payload.is_featured,
    )
    db.add(product)
    db.flush()

    # Create variants if provided
    if payload.variants:
        for v in payload.variants:
            variant = ProductVariant(
                product_id=product.id,
                size=v.size,
                color=v.color,
                sku=v.sku,
                stock_quantity=v.stock_quantity,
                is_active=v.is_active,
            )
            db.add(variant)

    db.commit()
    db.refresh(product)
    return ProductDetailResponse.model_validate(product)


@router.put(
    "/products/{product_id}",
    response_model=ProductDetailResponse,
    summary="Update product details",
)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
) -> ProductDetailResponse:
    product = db.scalar(
        select(Product)
        .where(Product.id == product_id)
        .options(selectinload(Product.category), selectinload(Product.variants), selectinload(Product.images))
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "variants":
            continue
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return ProductDetailResponse.model_validate(product)


@router.delete(
    "/products/{product_id}",
    summary="Safely toggle active state or delete product",
)
def delete_product(
    product_id: int,
    admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db),
):
    product = db.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    # Soft-delete by setting is_active = False so existing order references stay valid
    product.is_active = False
    db.commit()
    return {"ok": True, "message": f"Product '{product.name}' deactivated successfully."}
