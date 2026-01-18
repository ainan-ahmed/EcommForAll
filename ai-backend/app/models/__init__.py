from app.models.ai import (
    ProductDescriptionRequest,
    ProductDescriptionResponse,
    ProductVariant,
    Tone,
)

# Aliases matching backend DTO naming; will be superseded by generated models when available.
ProductDescriptionRequestDto = ProductDescriptionRequest
ProductDescriptionResponseDto = ProductDescriptionResponse


__all__ = [
    "ProductDescriptionRequest",
    "ProductDescriptionResponse",
    "ProductVariant",
    "Tone",
    "ProductDescriptionRequestDto",
    "ProductDescriptionResponseDto",
]
