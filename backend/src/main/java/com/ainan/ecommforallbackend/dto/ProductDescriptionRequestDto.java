package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductDescriptionRequestDto {
    @NotNull(message = "Product name is required")
    private String productName;
    private String category;
    private String brand;
    private String existingDescription;
    private Map<String, String> attributes;
    private String targetAudience;
    private Boolean hasVariants;
    private List<ProductVariantDto> variants;
    private String tone;
    private Integer maxLength;
}