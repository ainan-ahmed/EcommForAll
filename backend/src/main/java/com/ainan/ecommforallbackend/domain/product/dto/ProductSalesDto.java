package com.ainan.ecommforallbackend.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesDto {

    private UUID productId;

    private String productName;

    private Integer quantitySold;

    private String imageUrl;
}