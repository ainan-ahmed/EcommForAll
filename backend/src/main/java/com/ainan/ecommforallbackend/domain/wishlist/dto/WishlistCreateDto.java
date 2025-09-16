package com.ainan.ecommforallbackend.domain.wishlist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
}
