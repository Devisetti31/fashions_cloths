from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field, field_validator
import re

SLUG_REGEX = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Category name")
    slug: str = Field(..., min_length=2, max_length=120, description="URL-friendly category slug")
    description: Optional[str] = Field(None, max_length=2000, description="Category description")
    image_url: Optional[str] = Field(None, max_length=500, description="Category representative image")
    is_active: bool = Field(True, description="Whether the category is active")

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        slug = v.strip().lower()
        if not SLUG_REGEX.match(slug):
            raise ValueError("Slug must be lowercase alphanumeric with hyphens (e.g., 'festive-wear')")
        return slug


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = Field(None, min_length=2, max_length=120)
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            slug = v.strip().lower()
            if not SLUG_REGEX.match(slug):
                raise ValueError("Slug must be lowercase alphanumeric with hyphens")
            return slug
        return v


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryListResponse(BaseModel):
    items: List[CategoryResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)
