package com.ainan.ecommforallbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimilarProductsResponseDto {
    private Boolean success;
    private String message;
    private UUID sourceProductId;
    private String sourceProductName;
    private List<ProductDto> similarProducts;
    private Integer totalFound;
}
