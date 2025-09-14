package com.ainan.ecommforallbackend.domain.cart.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private String productDescription;
    private UUID variantId;
    private String sku;
    private Map<String, String> variantAttributes;
    private ProductImageDto imageUrl;
    private BigDecimal unitPrice;
    @NotNull(message = "Quantity is required")
    private int quantity;
    private BigDecimal totalPrice;
    private boolean inStock;
}
