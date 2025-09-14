package com.ainan.ecommforallbackend.domain.wishlist.dto;

import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistProductSummeryDto {
    private UUID id;
    private String name;
    private String sku;
    @JsonAlias({"isActive", "active", "is_active", "status"})
    private Boolean isActive;
    @JsonAlias({"minPrice", "min_price"})
    private BigDecimal minPrice;
    private ProductImageDto primaryImage;
    private String brand;
}