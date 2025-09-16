package com.ainan.ecommforallbackend.domain.product.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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

    @JsonAlias({ "isActive", "active", "is_active", "status" })
    private Boolean isActive;

    @JsonAlias({ "isFeatured", "featured", "is_featured" })
    private Boolean isFeatured;

    // Price for products without variants - required if no variants will be added
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    // Stock for products without variants - required if no variants will be added
    @PositiveOrZero(message = "Stock must be non-negative")
    private Integer stock;


    @NotNull(message = "Brand is required")
    private UUID brandId;

    @NotNull(message = "Category is required")
    private UUID categoryId;
}