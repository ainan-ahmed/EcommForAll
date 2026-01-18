from __future__ import annotations
from importlib import import_module
from typing import Any

from pydantic import BaseModel, Field

try:  # pragma: no cover - runtime path once contracts are generated
    generated = import_module("app.models.generated_ai")
    ProductDescriptionRequestDto = getattr(generated, "ProductDescriptionRequestDto")
    ProductDescriptionResponseDto = getattr(generated, "ProductDescriptionResponseDto")
    SimilarProductsResponseDto = getattr(generated, "SimilarProductsResponseDto")
    Tone = getattr(generated, "Tone", None)
except ModuleNotFoundError:  # pragma: no cover - development fallback
    from app.models.ai import (
        ProductDescriptionRequest as ProductDescriptionRequestDto,
    )
    from app.models.ai import (
        ProductDescriptionResponse as ProductDescriptionResponseDto,
    )
    from app.models.ai import (
        Tone,
    )

    class SimilarProductsResponseDto(BaseModel):
        success: bool = True
        message: str | None = None
        sourceProductId: Any | None = None
        sourceProductName: str | None = None
        similarProducts: list[Any] = Field(default_factory=list)
        totalFound: int | None = None
else:
    # If Tone was not present in generated models (unlikely), fall back to local Enum.
    if Tone is None:
        from app.models.ai import Tone

__all__ = [
    "ProductDescriptionRequestDto",
    "ProductDescriptionResponseDto",
    "SimilarProductsResponseDto",
    "Tone",
]
