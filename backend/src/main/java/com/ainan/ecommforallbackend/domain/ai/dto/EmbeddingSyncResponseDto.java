package com.ainan.ecommforallbackend.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmbeddingSyncResponseDto {
    int totalProducts;
    int indexed;
    int skipped;
    int failed;
}
