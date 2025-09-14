package com.ainan.ecommforallbackend.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {

    private UUID id;

    private UUID productId;

    private UUID variantId;

    private String productName;

    private String productDescription;

    private String variantName;

    private String variantAttributes;

    private String sku;

    private BigDecimal price;

    private Integer quantity;

    private String imageUrl;

    private BigDecimal subtotal;
}