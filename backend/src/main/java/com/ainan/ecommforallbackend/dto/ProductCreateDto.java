package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateDto {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    private String sku;

    private Boolean isActive = true;

    private Boolean isFeatured = false;

    @Positive(message = "Price must be positive")
    private BigDecimal minPrice;

    @NotNull(message = "Brand is required")
    private UUID brandId;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    @NotNull(message = "Seller is required")
    private UUID sellerId;

}