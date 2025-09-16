package com.ainan.ecommforallbackend.domain.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartItemCreateDto {
    @NotNull(message = "Product ID is required")
    private String productId;
    private String variantId;
    @NotNull(message = "Quantity is required")
    @Min(1)
    private int quantity;

}
