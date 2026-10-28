from fastapi import APIRouter
from app.api.routes import health, categories, products, auth, orders, admin

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(auth.router)
api_router.include_router(orders.router)
api_router.include_router(admin.router)
