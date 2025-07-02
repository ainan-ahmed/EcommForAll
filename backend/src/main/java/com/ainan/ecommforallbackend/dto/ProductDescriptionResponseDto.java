package com.ainan.ecommforallbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDescriptionResponseDto {

    private String generatedDescription;

    private String originalDescription;

    private Integer wordCount;

    private String tone;

    private LocalDateTime generatedAt;

    private Boolean success;

    private String errorMessage;

    public static ProductDescriptionResponseDto success(String description, String originalDescription,
                                                        String tone) {
        ProductDescriptionResponseDto response = new ProductDescriptionResponseDto();
        response.setGeneratedDescription(description);
        response.setOriginalDescription(originalDescription);
        response.setWordCount(description != null ? description.split("\\s+").length : 0);
        response.setTone(tone);
        response.setGeneratedAt(LocalDateTime.now());
        response.setSuccess(true);
        return response;
    }

    public static ProductDescriptionResponseDto error(String errorMessage) {
        ProductDescriptionResponseDto response = new ProductDescriptionResponseDto();
        response.setErrorMessage(errorMessage);
        response.setSuccess(false);
        response.setGeneratedAt(LocalDateTime.now());
        return response;
    }
}
