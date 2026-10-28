import os
from pathlib import Path
from alembic.config import Config
from alembic import command
from sqlalchemy import create_engine, inspect


def test_alembic_migrations_on_clean_database(tmp_path):
    """Test that Alembic can apply all migrations to a fresh database and create expected tables."""
    # Create path to temporary SQLite database file
    db_file = tmp_path / "test_migration.db"
    db_url = f"sqlite:///{db_file}"

    # Path to backend alembic.ini
    backend_dir = Path(__file__).parent.parent
    ini_path = backend_dir / "alembic.ini"
    assert ini_path.exists(), f"alembic.ini not found at {ini_path}"

    alembic_cfg = Config(str(ini_path))
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)
    alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))

    # Upgrade to head
    command.upgrade(alembic_cfg, "head")

    # Inspect created tables
    engine = create_engine(db_url)
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    # Verify tables created by migrations
    assert "categories" in tables
    assert "products" in tables
    assert "product_variants" in tables
    assert "product_images" in tables
    assert "alembic_version" in tables

    # Verify column presence in products
    columns = {col["name"] for col in inspector.get_columns("products")}
    assert "name" in columns
    assert "slug" in columns
    assert "price" in columns
    assert "sku" in columns
    assert "category_id" in columns
    assert "is_active" in columns
    assert "is_featured" in columns
    assert "created_at" in columns
