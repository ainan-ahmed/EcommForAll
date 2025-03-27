package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;
@Data
@AllArgsConstructor
public class ProductImageDto {
    private UUID id;
    @NotNull(message = "Product ID cannot be null")
    private UUID productId;
    @NotNull(message = "Image URL cannot be null")
    private String imageUrl;
    private String altText;
    private int sortOrder = 0;
}
