package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VariantImageDto {
    private UUID id;
    @NotBlank(message = "Variant ID is required")
    private UUID variantId;
    @NotNull(message = "Image URL cannot be null")
    private String imageUrl;
    private String altText;
    private int sortOrder = 0;
}
