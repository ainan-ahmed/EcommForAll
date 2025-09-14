package com.ainan.ecommforallbackend.domain.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistAddProductDto {
    @NotNull(message = "Product ID is required")
    private String productId;
}
