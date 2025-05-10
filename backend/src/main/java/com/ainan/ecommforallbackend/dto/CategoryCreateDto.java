package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
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
