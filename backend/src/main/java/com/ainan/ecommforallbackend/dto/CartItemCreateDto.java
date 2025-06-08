package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartItemCreateDto {
    @NotNull(message = "Product ID is required")
    private String productId;
    @NotNull(message = "Quantity is required")
    private int quantity;

}
