from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse, CategoryListResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get(
    "",
    response_model=List[CategoryResponse],
    summary="List Categories",
    description="Retrieve all active catalog categories ordered by display name.",
)
def list_categories(
    include_inactive: bool = Query(
        False, description="Include inactive categories (reserved for administrative views)"
    ),
    db: Session = Depends(get_db),
) -> List[Category]:
    stmt = select(Category)
    if not include_inactive:
        stmt = stmt.where(Category.is_active == True)
    stmt = stmt.order_by(Category.name.asc())
    
    categories = db.execute(stmt).scalars().all()
    return list(categories)


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Get Category by ID",
    description="Retrieve a single category by its integer identifier.",
)
def get_category_by_id(
    category_id: int,
    db: Session = Depends(get_db),
) -> Category:
    stmt = select(Category).where(Category.id == category_id)
    category = db.execute(stmt).scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found",
        )
    return category


@router.get(
    "/slug/{slug}",
    response_model=CategoryResponse,
    summary="Get Category by Slug",
    description="Retrieve a single category by its URL slug.",
)
def get_category_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> Category:
    clean_slug = slug.strip().lower()
    stmt = select(Category).where(Category.slug == clean_slug)
    category = db.execute(stmt).scalar_one_or_none()
    
    if not category or not category.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{slug}' not found or inactive",
        )
    return category
