package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CategoryDto {
    private UUID id;
    @NotNull(message = "Category name is required")
    private String name;
    private String imageUrl;
    @NotNull(message = "Slug is required")
    private String slug;
    private String fullSlug;
    private String description;
    private UUID parent;
    private List<UUID> subCategories;
    private Integer productCount;
}
