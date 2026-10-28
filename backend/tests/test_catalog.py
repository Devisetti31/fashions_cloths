import pytest
from decimal import Decimal
from starlette.testclient import TestClient
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.category import Category
from app.models.product import Product, ProductVariant, ProductImage


@pytest.fixture
def catalog_data(db_session: Session):
    """Seed test data for catalog tests and clean up afterwards."""
    # Clean up before
    db_session.query(ProductImage).delete()
    db_session.query(ProductVariant).delete()
    db_session.query(Product).delete()
    db_session.query(Category).delete()
    db_session.commit()

    # Create Categories
    sarees = Category(
        name="Sarees",
        slug="sarees",
        description="Handloom traditional sarees",
        image_url="/images/categories/sarees.jpg",
        is_active=True,
    )
    kurtis = Category(
        name="Kurtis",
        slug="kurtis",
        description="Designer kurtis and tunics",
        image_url="/images/categories/kurtis.jpg",
        is_active=True,
    )
    inactive_cat = Category(
        name="Archived Category",
        slug="archived-category",
        description="Hidden category",
        image_url="/images/categories/archived.jpg",
        is_active=False,
    )
    db_session.add_all([sarees, kurtis, inactive_cat])
    db_session.commit()

    # Create Products
    p1 = Product(
        name="Banarasi Katan Silk Saree",
        slug="banarasi-katan-silk-saree",
        description="Royal crimson handwoven saree with gold zari work.",
        price=Decimal("18500.00"),
        compare_at_price=Decimal("22000.00"),
        sku="TEST-SR-01",
        category_id=sarees.id,
        primary_image="/images/products/saree-1.jpg",
        is_active=True,
        is_featured=True,
        fabric="Pure Katan Silk",
        craft="Banarasi Brocade",
    )
    p2 = Product(
        name="Chanderi Handloom Saree",
        slug="chanderi-handloom-saree",
        description="Lightweight emerald chanderi silk saree.",
        price=Decimal("9500.00"),
        sku="TEST-SR-02",
        category_id=sarees.id,
        primary_image="/images/products/saree-2.jpg",
        is_active=True,
        is_featured=False,
        fabric="Chanderi Silk",
        craft="Hand Block Print",
    )
    p3 = Product(
        name="Chikankari Georgette Kurti",
        slug="chikankari-georgette-kurti",
        description="Ivory chikankari embroidered kurti.",
        price=Decimal("5200.00"),
        sku="TEST-KT-01",
        category_id=kurtis.id,
        primary_image="/images/products/kurti-1.jpg",
        is_active=True,
        is_featured=True,
        fabric="Georgette",
        craft="Lucknowi Chikankari",
    )
    p_inactive = Product(
        name="Discontinued Saree",
        slug="discontinued-saree",
        description="Out of production item.",
        price=Decimal("12000.00"),
        sku="TEST-INACTIVE-01",
        category_id=sarees.id,
        primary_image="/images/products/disc.jpg",
        is_active=False,
        is_featured=False,
    )
    db_session.add_all([p1, p2, p3, p_inactive])
    db_session.commit()

    # Add Variants for p1
    v1 = ProductVariant(
        product_id=p1.id,
        size="Free Size",
        color="Crimson Red",
        sku="TEST-SR-01-CRIMSON",
        stock_quantity=10,
        is_active=True,
    )
    v2 = ProductVariant(
        product_id=p3.id,
        size="M",
        color="Ivory",
        sku="TEST-KT-01-M-IVORY",
        stock_quantity=5,
        is_active=True,
    )
    v3 = ProductVariant(
        product_id=p3.id,
        size="L",
        color="Ivory",
        sku="TEST-KT-01-L-IVORY",
        stock_quantity=0,
        is_active=True,
    )
    db_session.add_all([v1, v2, v3])

    # Add Images for p1
    img1 = ProductImage(
        product_id=p1.id,
        image_url="/images/products/saree-1.jpg",
        alt_text="Front view",
        display_order=1,
        is_primary=True,
    )
    img2 = ProductImage(
        product_id=p1.id,
        image_url="/images/products/saree-1-pallu.jpg",
        alt_text="Pallu detail",
        display_order=2,
        is_primary=False,
    )
    db_session.add_all([img1, img2])
    db_session.commit()

    yield {
        "categories": [sarees, kurtis, inactive_cat],
        "products": [p1, p2, p3, p_inactive],
        "variants": [v1, v2, v3],
        "images": [img1, img2],
    }

    # Clean up after test
    db_session.query(ProductImage).delete()
    db_session.query(ProductVariant).delete()
    db_session.query(Product).delete()
    db_session.query(Category).delete()
    db_session.commit()


# ==============================================================================
# CATEGORY ENDPOINT TESTS
# ==============================================================================

def test_list_active_categories(client: TestClient, catalog_data):
    """GET /api/v1/categories returns list of active categories."""
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # inactive category must not be returned
    slugs = [c["slug"] for c in data]
    assert "sarees" in slugs
    assert "kurtis" in slugs
    assert "archived-category" not in slugs


def test_get_category_by_id(client: TestClient, catalog_data):
    """GET /api/v1/categories/{id} returns single category."""
    cat = catalog_data["categories"][0]
    response = client.get(f"/api/v1/categories/{cat.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Sarees"
    assert data["slug"] == "sarees"


def test_get_category_by_id_not_found(client: TestClient, catalog_data):
    """GET /api/v1/categories/{id} with unknown ID returns 404."""
    response = client.get("/api/v1/categories/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_category_by_slug(client: TestClient, catalog_data):
    """GET /api/v1/categories/slug/{slug} returns single category."""
    response = client.get("/api/v1/categories/slug/sarees")
    assert response.status_code == 200
    assert response.json()["name"] == "Sarees"


def test_get_category_by_slug_not_found(client: TestClient, catalog_data):
    """GET /api/v1/categories/slug/{slug} returns 404 if not found."""
    response = client.get("/api/v1/categories/slug/non-existent-slug")
    assert response.status_code == 404


# ==============================================================================
# PRODUCT ENDPOINT TESTS
# ==============================================================================

def test_list_products_default_pagination(client: TestClient, catalog_data):
    """GET /api/v1/products returns paginated active products."""
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data

    # 3 active products, inactive one excluded
    assert data["total"] == 3
    assert len(data["items"]) == 3
    assert data["page"] == 1

    # Verify money is serialized as exact string with 2 decimal places
    item = next(p for p in data["items"] if p["slug"] == "banarasi-katan-silk-saree")
    assert item["price"] == "18500.00"
    assert item["compare_at_price"] == "22000.00"


def test_list_products_featured_filter(client: TestClient, catalog_data):
    """GET /api/v1/products?is_featured=true filters to only featured items."""
    response = client.get("/api/v1/products?is_featured=true")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    for item in data["items"]:
        assert item["is_featured"] is True


def test_list_products_category_filter(client: TestClient, catalog_data):
    """GET /api/v1/products?category=kurtis filters to kurtis only."""
    response = client.get("/api/v1/products?category=kurtis")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["slug"] == "chikankari-georgette-kurti"


def test_list_products_price_filter(client: TestClient, catalog_data):
    """GET /api/v1/products?min_price=10000&max_price=20000 filters by price range."""
    response = client.get("/api/v1/products?min_price=10000&max_price=20000")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["slug"] == "banarasi-katan-silk-saree"


def test_list_products_search(client: TestClient, catalog_data):
    """GET /api/v1/products?search=chanderi finds matching product."""
    response = client.get("/api/v1/products?search=chanderi")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["slug"] == "chanderi-handloom-saree"


def test_list_products_sorting(client: TestClient, catalog_data):
    """GET /api/v1/products?sort=price_asc sorts lowest to highest."""
    response = client.get("/api/v1/products?sort=price_asc")
    assert response.status_code == 200
    items = response.json()["items"]
    prices = [Decimal(p["price"]) for p in items]
    assert prices == sorted(prices)

    # Sort descending
    response_desc = client.get("/api/v1/products?sort=price_desc")
    assert response_desc.status_code == 200
    prices_desc = [Decimal(p["price"]) for p in response_desc.json()["items"]]
    assert prices_desc == sorted(prices, reverse=True)


def test_get_product_by_id(client: TestClient, catalog_data):
    """GET /api/v1/products/{id} returns product detail with category, variants, and images."""
    p1 = catalog_data["products"][0]
    response = client.get(f"/api/v1/products/{p1.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Banarasi Katan Silk Saree"
    assert data["category"]["name"] == "Sarees"
    assert len(data["variants"]) == 1
    assert data["variants"][0]["sku"] == "TEST-SR-01-CRIMSON"
    assert len(data["images"]) == 2


def test_get_product_by_id_not_found(client: TestClient, catalog_data):
    """GET /api/v1/products/{id} returns 404 for unknown product."""
    response = client.get("/api/v1/products/999999")
    assert response.status_code == 404


def test_get_inactive_product_returns_404(client: TestClient, catalog_data):
    """GET /api/v1/products/{id} returns 404 for inactive product on public endpoint."""
    p_inactive = catalog_data["products"][3]
    response = client.get(f"/api/v1/products/{p_inactive.id}")
    assert response.status_code == 404


def test_get_product_by_slug(client: TestClient, catalog_data):
    """GET /api/v1/products/slug/{slug} returns product with variants and images."""
    response = client.get("/api/v1/products/slug/banarasi-katan-silk-saree")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "banarasi-katan-silk-saree"
    assert data["fabric"] == "Pure Katan Silk"
    assert len(data["variants"]) >= 1


def test_get_product_variants(client: TestClient, catalog_data):
    """GET /api/v1/products/{id}/variants returns active variants for the product."""
    p3 = catalog_data["products"][2]
    response = client.get(f"/api/v1/products/{p3.id}/variants")
    assert response.status_code == 200
    variants = response.json()
    assert len(variants) == 2
    skus = [v["sku"] for v in variants]
    assert "TEST-KT-01-M-IVORY" in skus
    assert "TEST-KT-01-L-IVORY" in skus


# ==============================================================================
# VALIDATION TESTS
# ==============================================================================

def test_reject_invalid_pagination(client: TestClient, catalog_data):
    """GET /api/v1/products rejects page < 1 or page_size > 100."""
    res1 = client.get("/api/v1/products?page=0")
    assert res1.status_code == 422

    res2 = client.get("/api/v1/products?page_size=200")
    assert res2.status_code == 422


def test_reject_invalid_price_filters(client: TestClient, catalog_data):
    """GET /api/v1/products rejects min_price < 0 or min_price > max_price."""
    res1 = client.get("/api/v1/products?min_price=-10")
    assert res1.status_code == 422

    res2 = client.get("/api/v1/products?min_price=5000&max_price=1000")
    assert res2.status_code == 400
    assert "cannot exceed" in res2.json()["detail"].lower()


def test_reject_unsupported_sort_field(client: TestClient, catalog_data):
    """GET /api/v1/products rejects unrecognized sort option."""
    res = client.get("/api/v1/products?sort=invalid_sort_field")
    assert res.status_code == 400
    assert "unsupported sort field" in res.json()["detail"].lower()


# ==============================================================================
# SECURITY TESTS
# ==============================================================================

def test_public_write_operations_not_allowed(client: TestClient):
    """Ensure catalog write operations are not exposed to public users (405 Method Not Allowed)."""
    # Attempt POST to categories
    res1 = client.post("/api/v1/categories", json={"name": "Hacked", "slug": "hacked"})
    assert res1.status_code in [404, 405]

    # Attempt POST to products
    res2 = client.post("/api/v1/products", json={"name": "Hacked", "price": "100.00"})
    assert res2.status_code in [404, 405]

    # Attempt PUT to products
    res3 = client.put("/api/v1/products/1", json={"price": "1.00"})
    assert res3.status_code in [404, 405]

    # Attempt DELETE to products
    res4 = client.delete("/api/v1/products/1")
    assert res4.status_code in [404, 405]


# ==============================================================================
# DATABASE CONSTRAINT & INTEGRITY TESTS
# ==============================================================================

def test_product_price_must_be_positive(db_session: Session, catalog_data):
    """Ensure database check constraint rejects non-positive price."""
    cat = catalog_data["categories"][0]
    invalid_product = Product(
        name="Zero Price Saree",
        slug="zero-price-saree",
        price=Decimal("-10.00"),
        sku="TEST-ZERO-PRICE",
        category_id=cat.id,
    )
    db_session.add(invalid_product)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_product_sku_unique_constraint(db_session: Session, catalog_data):
    """Ensure duplicate product SKU triggers IntegrityError."""
    cat = catalog_data["categories"][0]
    dup_product = Product(
        name="Duplicate SKU Saree",
        slug="duplicate-sku-saree",
        price=Decimal("5000.00"),
        sku="TEST-SR-01",  # Already used by p1
        category_id=cat.id,
    )
    db_session.add(dup_product)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_product_slug_unique_constraint(db_session: Session, catalog_data):
    """Ensure duplicate product slug triggers IntegrityError."""
    cat = catalog_data["categories"][0]
    dup_product = Product(
        name="Duplicate Slug Saree",
        slug="banarasi-katan-silk-saree",  # Already used by p1
        price=Decimal("5000.00"),
        sku="TEST-UNIQUE-SKU-NEW",
        category_id=cat.id,
    )
    db_session.add(dup_product)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_variant_negative_stock_constraint(db_session: Session, catalog_data):
    """Ensure variant cannot have negative stock."""
    p1 = catalog_data["products"][0]
    invalid_variant = ProductVariant(
        product_id=p1.id,
        size="XL",
        color="Red",
        sku="TEST-NEG-STOCK",
        stock_quantity=-5,
    )
    db_session.add(invalid_variant)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
