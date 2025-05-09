package com.ainan.ecommforallbackend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductFilterDto {
    private String name;
    private UUID brandId;
    private UUID categoryId;
    private UUID sellerId;
    private Boolean isActive;
    private Boolean isFeatured;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
//    private String search;
}