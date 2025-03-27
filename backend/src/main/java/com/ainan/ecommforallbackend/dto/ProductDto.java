package com.ainan.ecommforallbackend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private UUID id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotBlank(message = "SKU is required")
    private String sku;

    @JsonAlias({"isActive", "active","is_active","status"})
    private Boolean isActive;
    @JsonAlias({"isFeatured", "featured","is_featured"})
    private Boolean isFeatured;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Brand is required")
    private UUID brandId;

    @NotNull(message = "Category is required")
    private UUID categoryId;
    @NotNull(message = "Seller is required")
    private UUID sellerId;

    private List<ProductImageDto> images;
    private List<ProductVariantDto> variants;
}