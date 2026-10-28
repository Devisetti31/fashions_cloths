from decimal import Decimal
from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_ORDER_STATUSES = {"PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"}


class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str = Field(..., min_length=1, max_length=200)
    product_image: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int = Field(1, ge=1, le=100)
    unit_price: Optional[Decimal] = Field(None, ge=Decimal("0.00"))


class OrderCreateRequest(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_length=1, description="Order line items")
    shipping_address: Dict[str, Any] = Field(..., description="Customer shipping destination")
    contact_phone: Optional[str] = Field(None, max_length=30)
    payment_method: str = Field("CARD", max_length=50)
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: Optional[int] = None
    product_name: str
    product_image: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    status: str
    subtotal: Decimal
    shipping_fee: Decimal
    total_amount: Decimal
    shipping_address: Any
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    payment_method: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdateRequest(BaseModel):
    status: str = Field(..., description="Target status")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        upper = v.strip().upper()
        if upper not in VALID_ORDER_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Allowed values: {', '.join(sorted(VALID_ORDER_STATUSES))}")
        return upper


class AdminMetricsResponse(BaseModel):
    total_products: int
    total_orders: int
    total_revenue: Decimal
    total_customers: int
    recent_orders: List[OrderResponse] = []
