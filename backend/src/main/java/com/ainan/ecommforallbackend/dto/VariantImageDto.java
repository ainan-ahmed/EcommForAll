package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    private String altText;
    private int sortOrder = 0;
}
