import pytest
from decimal import Decimal
from starlette.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order
from app.core.security import get_password_hash


@pytest.fixture
def test_users(db_session: Session):
    """Seed customer and admin users in isolated test database."""
    # Clean previous
    db_session.query(Order).delete()
    db_session.query(User).delete()
    db_session.commit()

    customer = User(
        full_name="Priya Sharma",
        email="priya@example.com",
        hashed_password=get_password_hash("Password123"),
        phone_number="+91 98765 43210",
        is_active=True,
        is_admin=False,
    )
    admin = User(
        full_name="Atelier Admin",
        email="admin@example.com",
        hashed_password=get_password_hash("AdminPass123"),
        phone_number="+91 99999 88888",
        is_active=True,
        is_admin=True,
    )
    db_session.add_all([customer, admin])
    db_session.commit()
    db_session.refresh(customer)
    db_session.refresh(admin)
    return {"customer": customer, "admin": admin}


def test_customer_registration_success(client: TestClient, db_session: Session):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Ananya Roy",
            "email": "ananya@example.com",
            "password": "RoyPassword123",
            "phone_number": "+91 91234 56789",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "ananya@example.com"
    assert data["user"]["full_name"] == "Ananya Roy"
    assert data["user"]["is_admin"] is False  # Cannot become admin via registration


def test_duplicate_registration_rejected(client: TestClient, test_users):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Duplicate Priya",
            "email": "priya@example.com",  # Already exists
            "password": "NewPassword123",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_registration_weak_password_rejected(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test User",
            "email": "testweak@example.com",
            "password": "short",
        },
    )
    assert response.status_code == 422


def test_customer_login_success(client: TestClient, test_users):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "Password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "priya@example.com"
    assert data["user"]["is_admin"] is False


def test_login_invalid_password_rejected(client: TestClient, test_users):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "WrongPassword999"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_login_nonexistent_email_rejected(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "AnyPassword123"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_current_user_profile_authenticated(client: TestClient, test_users):
    # Log in first
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "Password123"},
    )
    token = login_resp.json()["access_token"]

    profile_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert profile_resp.status_code == 200
    data = profile_resp.json()
    assert data["email"] == "priya@example.com"
    assert data["full_name"] == "Priya Sharma"


def test_current_user_profile_unauthorized(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_profile_update(client: TestClient, test_users):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "Password123"},
    )
    token = login_resp.json()["access_token"]

    update_resp = client.patch(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Priya S. Verma", "phone_number": "+91 98888 77777"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["full_name"] == "Priya S. Verma"
    assert update_resp.json()["phone_number"] == "+91 98888 77777"


def test_order_creation_and_customer_isolation(client: TestClient, db_session: Session, test_users):
    # Seed a category and product
    cat = Category(name="Bridal", slug="bridal-cat", is_active=True)
    db_session.add(cat)
    db_session.flush()

    prod = Product(
        name="Crimson Zardozi Lehenga",
        slug="crimson-zardozi-lehenga",
        price=Decimal("45000.00"),
        sku="TEST-LEH-01",
        category_id=cat.id,
        is_active=True,
    )
    db_session.add(prod)
    db_session.commit()
    db_session.refresh(prod)

    # Customer 1 (Priya) logs in
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "Password123"},
    )
    priya_token = login_resp.json()["access_token"]

    # Priya places an order
    order_payload = {
        "items": [
            {
                "product_id": prod.id,
                "product_name": prod.name,
                "size": "M",
                "quantity": 1,
            }
        ],
        "shipping_address": {
            "fullName": "Priya Sharma",
            "street": "12 Heritage Lane",
            "city": "Jaipur",
            "state": "Rajasthan",
            "postalCode": "302001",
        },
        "payment_method": "UPI",
    }

    create_resp = client.post(
        "/api/v1/orders",
        headers={"Authorization": f"Bearer {priya_token}"},
        json=order_payload,
    )
    assert create_resp.status_code == 201
    order_data = create_resp.json()
    assert float(order_data["total_amount"]) == 45000.0  # Above 15k so free shipping
    assert order_data["status"] == "CONFIRMED"
    assert len(order_data["items"]) == 1
    assert float(order_data["items"][0]["unit_price"]) == 45000.0

    # Priya gets her order history
    my_orders_resp = client.get(
        "/api/v1/orders/my-orders",
        headers={"Authorization": f"Bearer {priya_token}"},
    )
    assert my_orders_resp.status_code == 200
    assert len(my_orders_resp.json()) == 1

    # Register second customer (Rohan)
    reg_rohan = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Rohan Kapoor",
            "email": "rohan@example.com",
            "password": "RohanPassword123",
        },
    )
    rohan_token = reg_rohan.json()["access_token"]

    # Rohan's order list must be EMPTY (Strict customer isolation)
    rohan_orders_resp = client.get(
        "/api/v1/orders/my-orders",
        headers={"Authorization": f"Bearer {rohan_token}"},
    )
    assert rohan_orders_resp.status_code == 200
    assert len(rohan_orders_resp.json()) == 0

    # Rohan attempts to view Priya's order directly by ID -> Forbidden
    priya_order_id = order_data["id"]
    forbidden_resp = client.get(
        f"/api/v1/orders/{priya_order_id}",
        headers={"Authorization": f"Bearer {rohan_token}"},
    )
    assert forbidden_resp.status_code == 403


def test_admin_metrics_and_permissions(client: TestClient, test_users):
    # Customer tries to access admin metrics -> 403 Forbidden
    cust_login = client.post(
        "/api/v1/auth/login",
        json={"email": "priya@example.com", "password": "Password123"},
    )
    cust_token = cust_login.json()["access_token"]

    forbidden = client.get(
        "/api/v1/admin/metrics",
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert forbidden.status_code == 403
    assert "Administrator privileges required" in forbidden.json()["detail"]

    # Admin logs in
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass123"},
    )
    admin_token = admin_login.json()["access_token"]
    assert admin_login.json()["user"]["is_admin"] is True

    # Admin accesses metrics -> 200 OK
    metrics_resp = client.get(
        "/api/v1/admin/metrics",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert metrics_resp.status_code == 200
    metrics = metrics_resp.json()
    assert "total_products" in metrics
    assert "total_orders" in metrics
    assert "total_revenue" in metrics
    assert "total_customers" in metrics
