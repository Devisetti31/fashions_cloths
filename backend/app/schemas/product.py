from decimal import Decimal
from datetime import datetime
from typing import Optional, List, Union
from pydantic import BaseModel, ConfigDict, Field, field_validator, field_serializer, model_validator
import re

from app.schemas.category import CategoryResponse

SLUG_REGEX = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SKU_REGEX = re.compile(r"^[A-Za-z0-9\-_]+$")


# Product Variant Schemas
class ProductVariantBase(BaseModel):
    size: str = Field(..., min_length=1, max_length=50, description="Garment size (e.g., 'XS', 'Free Size')")
    color: Optional[str] = Field(None, max_length=50, description="Color swatch name")
    sku: str = Field(..., min_length=2, max_length=100, description="Unique variant SKU")
    stock_quantity: int = Field(0, ge=0, description="Available stock quantity")
    is_active: bool = Field(True, description="Whether variant is purchasable")

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: str) -> str:
        clean = v.strip().upper()
        if not SKU_REGEX.match(clean):
            raise ValueError("SKU may only contain alphanumeric characters, hyphens, and underscores")
        return clean


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantUpdate(BaseModel):
    size: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, max_length=50)
    sku: Optional[str] = Field(None, min_length=2, max_length=100)
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip().upper()
            if not SKU_REGEX.match(clean):
                raise ValueError("SKU may only contain alphanumeric characters, hyphens, and underscores")
            return clean
        return v


class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Product Image Schemas
class ProductImageResponse(BaseModel):
    id: int
    product_id: int
    image_url: str
    alt_text: Optional[str] = None
    display_order: int = 0
    is_primary: bool = False

    model_config = ConfigDict(from_attributes=True)


# Product Schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200, description="Garment title")
    slug: str = Field(..., min_length=2, max_length=250, description="URL slug")
    description: Optional[str] = Field(None, description="Detailed artisanal narrative")
    
    price: Decimal = Field(..., gt=Decimal("0.00"), description="Positive selling price in INR")
    compare_at_price: Optional[Decimal] = Field(None, ge=Decimal("0.00"), description="Original comparison price")
    
    sku: str = Field(..., min_length=2, max_length=100, description="Unique product master SKU")
    category_id: int = Field(..., gt=0, description="Foreign key to Category")
    
    primary_image: Optional[str] = Field(None, max_length=500, description="Primary campaign image URL")
    fabric: Optional[str] = Field(None, max_length=250, description="Fabric composition")
    craft: Optional[str] = Field(None, max_length=250, description="Artisanal craft technique")
    details: Optional[List[str]] = Field(default_factory=list, description="Artisan bullet points")
    
    is_active: bool = Field(True, description="Whether product is live on storefront")
    is_featured: bool = Field(False, description="Whether displayed in curated showcase")

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        slug = v.strip().lower()
        if not SLUG_REGEX.match(slug):
            raise ValueError("Slug must be lowercase alphanumeric with hyphens")
        return slug

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: str) -> str:
        clean = v.strip().upper()
        if not SKU_REGEX.match(clean):
            raise ValueError("SKU may only contain alphanumeric characters, hyphens, and underscores")
        return clean

    @model_validator(mode="after")
    def validate_prices(self):
        if self.compare_at_price is not None and self.compare_at_price < self.price:
            raise ValueError("Comparison price (compare_at_price) cannot be lower than the selling price")
        return self


class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    slug: Optional[str] = Field(None, min_length=2, max_length=250)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    compare_at_price: Optional[Decimal] = Field(None, ge=Decimal("0.00"))
    sku: Optional[str] = Field(None, min_length=2, max_length=100)
    category_id: Optional[int] = Field(None, gt=0)
    primary_image: Optional[str] = None
    fabric: Optional[str] = None
    craft: Optional[str] = None
    details: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            slug = v.strip().lower()
            if not SLUG_REGEX.match(slug):
                raise ValueError("Slug must be lowercase alphanumeric with hyphens")
            return slug
        return v


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    variants: List[ProductVariantResponse] = Field(default_factory=list)
    images: List[ProductImageResponse] = Field(default_factory=list)
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("price")
    def serialize_price(self, price: Decimal) -> str:
        return f"{price:.2f}"

    @field_serializer("compare_at_price")
    def serialize_compare_at_price(self, compare_at_price: Optional[Decimal]) -> Optional[str]:
        if compare_at_price is None:
            return None
        return f"{compare_at_price:.2f}"


class ProductDetailResponse(ProductResponse):
    pass


class PaginatedProductResponse(BaseModel):
    items: List[ProductResponse]
    total: int = Field(..., ge=0, description="Total matching items")
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Items per page")
    total_pages: int = Field(..., ge=0, description="Total available pages")

    model_config = ConfigDict(from_attributes=True)
