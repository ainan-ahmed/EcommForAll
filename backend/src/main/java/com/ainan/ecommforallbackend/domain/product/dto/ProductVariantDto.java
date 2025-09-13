package com.ainan.ecommforallbackend.domain.product.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDto {
    private UUID id;
    @NotNull(message = "Product ID is required")
    private UUID productId;
    @NotNull(message = "attribute values are required")
    private Map<String, String> attributeValues;

    private String sku;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Positive(message = "Stock must be positive")
    private int stock;

    private List<VariantImageDto> images;
}