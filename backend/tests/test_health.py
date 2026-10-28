from unittest.mock import MagicMock
from starlette.testclient import TestClient
from app.db.session import get_db
from app.main import app


def test_health_check_success(client: TestClient):
    """Test that GET /api/v1/health returns 200 and sanitized health details."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "ES ETHNIC STYLES"
    assert data["environment"] in ["development", "production", "test"]
    assert data["database"] == "connected"
    assert "timestamp" in data

    # Security check: ensure no sensitive information is leaked
    forbidden_keys = ["secret", "password", "token", "key", "database_url", "dsn"]
    for key in forbidden_keys:
        assert key not in data
        assert key not in [k.lower() for k in data.keys()]


def test_root_endpoint(client: TestClient):
    """Test that GET / returns brand greeting, tagline, and reference links."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["brand"] == "ES ETHNIC STYLES"
    assert data["tagline"] == "Timeless Tradition, Modern You"
    assert "health" in data
    assert "docs" in data


def test_docs_available(client: TestClient):
    """Test that GET /docs is accessible in development mode."""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "swagger-ui" in response.text.lower()


def test_health_check_database_failure(client: TestClient):
    """Test that database failure yields a sanitized 503 without leaking system traces."""
    mock_db = MagicMock()
    mock_db.execute.side_effect = Exception("Simulated DB connection failure")

    def override_get_db_failure():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db_failure
    try:
        response = client.get("/api/v1/health")
        assert response.status_code == 503
        data = response.json()
        assert data["error"] is True
        assert data["status_code"] == 503
        # Ensure the raw python exception trace is NOT leaked to caller
        assert "Simulated DB connection failure" not in str(data)
    finally:
        app.dependency_overrides.clear()
