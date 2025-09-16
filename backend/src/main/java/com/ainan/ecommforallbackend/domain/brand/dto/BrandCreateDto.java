package com.ainan.ecommforallbackend.domain.brand.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BrandCreateDto {
    @NotNull(message = "Brand name is required")
    private String name;
    @NotNull(message = "Description is required")
    private String description;
    private String imageUrl;
    private String website;


}
