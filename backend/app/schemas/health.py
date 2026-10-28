from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "healthy",
                "app_name": "ES ETHNIC STYLES",
                "environment": "development",
                "timestamp": "2026-10-27T08:55:00Z",
                "database": "connected",
            }
        }
    )

    status: str = Field(..., description="Operational status of the service", examples=["healthy"])
    app_name: str = Field(..., description="Application name", examples=["ES ETHNIC STYLES"])
    environment: str = Field(..., description="Deployment environment", examples=["development"])
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    database: str = Field(..., description="Database connectivity status", examples=["connected"])
