from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.models.contracts import (
    ProductDescriptionRequestDto,
    ProductDescriptionResponseDto,
    SimilarProductsResponseDto,
)
from app.services.ai import find_similar_products, generate_description

router = APIRouter()


@router.get("/ai/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/ai/generate-description",
    response_model=ProductDescriptionResponseDto,
    summary="Generate or improve a product description",
)
async def generate_description_endpoint(
    payload: ProductDescriptionRequestDto,
    product_id: UUID | None = Query(default=None, alias="productId"),
) -> ProductDescriptionResponseDto:
    return await generate_description(payload, product_id)


@router.get(
    "/ai/similar-products/{product_id}",
    response_model=SimilarProductsResponseDto,
    summary="Find similar products",
)
async def similar_products_endpoint(
    product_id: UUID,
    limit: int = Query(default=10, ge=1, le=20),
) -> SimilarProductsResponseDto:
    result = await find_similar_products(product_id, limit)
    if not result.success:
        raise HTTPException(
            status_code=503, detail=result.message or "Service unavailable"
        )
    return result
