from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class Tone(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    TECHNICAL = "technical"
    MARKETING = "marketing"


class ProductVariant(BaseModel):
    """Product variant details including attribute values and inventory."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    attribute_values: dict[str, str] = Field(
        default_factory=dict, alias="attributeValues"
    )
    price: float | None = Field(None, ge=0)
    stock: int | None = Field(None, ge=0)


class ProductDescriptionRequest(BaseModel):
    """Payload for generating or improving a product description."""

    model_config = ConfigDict(
        populate_by_name=True, extra="ignore", str_strip_whitespace=True
    )

    product_id: UUID | None = Field(None, alias="productId")
    product_name: str | None = Field(None, alias="productName")
    category: str | None = None
    brand: str | None = None
    existing_description: str | None = Field(None, alias="existingDescription")
    attributes: dict[str, str] = Field(default_factory=dict)
    has_variants: bool = Field(default=False, alias="hasVariants")
    variants: list[ProductVariant] = Field(default_factory=list)
    target_audience: str | None = Field(None, alias="targetAudience")
    tone: Tone = Tone.PROFESSIONAL
    max_length: int = Field(default=150, alias="maxLength", ge=1, le=1000)

    @model_validator(mode="after")
    def ensure_product_reference(self) -> ProductDescriptionRequest:
        if not self.product_id and not self.product_name:
            raise ValueError("Either productId or productName is required.")

        if self.variants and not self.has_variants:
            self.has_variants = True
        if self.has_variants and not self.variants:
            raise ValueError("Variants are required when hasVariants is true.")
        return self


class ProductDescriptionResponse(BaseModel):
    """Standard response envelope for description generation."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    generated_description: str | None = Field(None, alias="generatedDescription")
    original_description: str | None = Field(None, alias="originalDescription")
    tone: Tone | None = None
    word_count: int | None = Field(None, alias="wordCount", ge=0)
    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), alias="generatedAt"
    )
    success: bool = True
    error_message: str | None = Field(None, alias="errorMessage")

    @classmethod
    def failure(
        cls, message: str, *, extra: dict[str, Any] | None = None
    ) -> ProductDescriptionResponse:
        payload: dict[str, Any] = {
            "success": False,
            "errorMessage": message,
            "generatedDescription": None,
            "wordCount": 0,
            "tone": None,
        }
        if extra:
            payload.update(extra)
        return cls.model_validate(payload)
