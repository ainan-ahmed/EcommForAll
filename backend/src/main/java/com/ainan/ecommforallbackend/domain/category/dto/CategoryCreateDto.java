package com.ainan.ecommforallbackend.domain.category.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class CategoryCreateDto {
    @NotNull(message = "Category name is required")
    private String name;
    private UUID parent;
    private String description;
    private String imageUrl;
}
