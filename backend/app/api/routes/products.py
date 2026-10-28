import math
from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, joinedload, selectinload

from app.db.session import get_db
from app.models.category import Category
from app.models.product import Product, ProductVariant, ProductImage
from app.schemas.product import (
    ProductResponse,
    ProductDetailResponse,
    ProductVariantResponse,
    PaginatedProductResponse,
)

router = APIRouter(prefix="/products", tags=["Products"])

ALLOWED_SORTS = {
    "featured": (Product.is_featured.desc(), Product.created_at.desc()),
    "newest": (Product.created_at.desc(),),
    "price_asc": (Product.price.asc(),),
    "price_desc": (Product.price.desc(),),
    "name_asc": (Product.name.asc(),),
}


@router.get(
    "",
    response_model=PaginatedProductResponse,
    summary="List and Filter Active Products",
    description="Retrieve a paginated collection of active boutique products with search, category filtering, price bounds, and sorting.",
)
def list_products(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(12, ge=1, le=100, description="Number of items per page (max 100)"),
    search: Optional[str] = Query(None, max_length=100, description="Search term for name, description, fabric, or craft"),
    category: Optional[str] = Query(None, description="Category slug to filter by"),
    category_id: Optional[int] = Query(None, gt=0, description="Category integer ID to filter by"),
    min_price: Optional[Decimal] = Query(None, ge=Decimal("0.00"), description="Minimum price boundary"),
    max_price: Optional[Decimal] = Query(None, ge=Decimal("0.00"), description="Maximum price boundary"),
    sort: str = Query("featured", description="Sorting field: featured, newest, price_asc, price_desc, name_asc"),
    is_featured: Optional[bool] = Query(None, description="Filter specifically for featured heirloom pieces"),
    db: Session = Depends(get_db),
) -> PaginatedProductResponse:
    # Validate sort parameter
    if sort not in ALLOWED_SORTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported sort field '{sort}'. Allowed options: {', '.join(ALLOWED_SORTS.keys())}",
        )

    # Validate price bounds
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum price boundary (min_price) cannot exceed maximum price boundary (max_price)",
        )

    # Base query for active products
    base_stmt = select(Product).where(Product.is_active == True)

    # Filter by category slug or category_id
    if category:
        clean_cat = category.strip().lower()
        # Subquery to match category slug
        base_stmt = base_stmt.join(Product.category).where(Category.slug == clean_cat)
    elif category_id:
        base_stmt = base_stmt.where(Product.category_id == category_id)

    # Filter by search query
    if search and search.strip():
        q_term = f"%{search.strip().lower()}%"
        base_stmt = base_stmt.where(
            or_(
                func.lower(Product.name).like(q_term),
                func.lower(Product.description).like(q_term),
                func.lower(Product.fabric).like(q_term),
                func.lower(Product.craft).like(q_term),
                func.lower(Product.sku).like(q_term),
            )
        )

    # Filter by min/max price
    if min_price is not None:
        base_stmt = base_stmt.where(Product.price >= min_price)
    if max_price is not None:
        base_stmt = base_stmt.where(Product.price <= max_price)

    # Filter by is_featured
    if is_featured is not None:
        base_stmt = base_stmt.where(Product.is_featured == is_featured)

    # Calculate total count efficiently
    count_stmt = select(func.count()).select_from(base_stmt.subquery())
    total_count = db.execute(count_stmt).scalar() or 0

    # Calculate total pages
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

    # Apply sorting and pagination
    order_criteria = ALLOWED_SORTS[sort]
    paginated_stmt = (
        base_stmt.options(
            joinedload(Product.category),
            selectinload(Product.variants),
            selectinload(Product.images),
        )
        .order_by(*order_criteria)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    items = db.execute(paginated_stmt).scalars().unique().all()

    return PaginatedProductResponse(
        items=list(items),
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/slug/{slug}",
    response_model=ProductDetailResponse,
    summary="Get Product by Slug",
    description="Retrieve a single product by its URL slug, including related category, active variants, and images.",
)
def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> Product:
    clean_slug = slug.strip().lower()
    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            selectinload(Product.variants),
            selectinload(Product.images),
        )
        .where(Product.slug == clean_slug)
    )
    product = db.execute(stmt).scalar_one_or_none()

    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found or inactive",
        )
    return product


@router.get(
    "/{product_id}",
    response_model=ProductDetailResponse,
    summary="Get Product by ID",
    description="Retrieve a single product by its integer ID, including category, variants, and gallery images.",
)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
) -> Product:
    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            selectinload(Product.variants),
            selectinload(Product.images),
        )
        .where(Product.id == product_id)
    )
    product = db.execute(stmt).scalar_one_or_none()

    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found or inactive",
        )
    return product


@router.get(
    "/{product_id}/variants",
    response_model=List[ProductVariantResponse],
    summary="Get Product Variants",
    description="Retrieve all active purchasing variants (sizes, colors, stock) for a specific product.",
)
def get_product_variants(
    product_id: int,
    db: Session = Depends(get_db),
) -> List[ProductVariant]:
    # Verify product exists
    product_exists = db.execute(
        select(Product.id).where(Product.id == product_id, Product.is_active == True)
    ).scalar_one_or_none()

    if not product_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found or inactive",
        )

    stmt = (
        select(ProductVariant)
        .where(ProductVariant.product_id == product_id, ProductVariant.is_active == True)
        .order_by(ProductVariant.size.asc())
    )
    variants = db.execute(stmt).scalars().all()
    return list(variants)
