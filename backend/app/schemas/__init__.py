"""Pydantic schemas package."""
from app.schemas.health import HealthResponse
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse,
)
from app.schemas.product import (
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse,
    ProductImageResponse,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
    PaginatedProductResponse,
)

from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    UserUpdateRequest,
    AuthTokenResponse,
)
from app.schemas.order import (
    OrderItemCreate,
    OrderCreateRequest,
    OrderItemResponse,
    OrderResponse,
    OrderStatusUpdateRequest,
    AdminMetricsResponse,
)

__all__ = [
    "HealthResponse",
    "CategoryCreate",
    "CategoryUpdate",
    "CategoryResponse",
    "CategoryListResponse",
    "ProductVariantCreate",
    "ProductVariantUpdate",
    "ProductVariantResponse",
    "ProductImageResponse",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductDetailResponse",
    "PaginatedProductResponse",
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "UserUpdateRequest",
    "AuthTokenResponse",
    "OrderItemCreate",
    "OrderCreateRequest",
    "OrderItemResponse",
    "OrderResponse",
    "OrderStatusUpdateRequest",
    "AdminMetricsResponse",
]
