package com.ainan.ecommforallbackend.domain.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariantImageCreateDto {
    @NotNull(message = "Variant ID is required")
    private UUID variantId;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String altText;

    private int sortOrder = 0;
}