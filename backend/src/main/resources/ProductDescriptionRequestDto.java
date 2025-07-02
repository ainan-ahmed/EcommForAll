package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDescriptionRequestDto {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String category;

    private String brand;

    private String existingDescription;

    // Renamed from specifications to attributes to match variant entity
    private Map<String, String> attributes;

    private String targetAudience;

    private String tone; // professional, casual, technical, marketing

    private Integer maxLength; // maximum description length in words

    // Variant-specific information
    private List<ProductVariantDto> variants;

    private Boolean hasVariants; // flag to indicate if product has variants

}