package com.ainan.ecommforallbackend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BrandDto {
    private UUID id;
    @NotNull(message = "Brand name is required")
    private String name;
    @NotNull(message = "Description is required")
    private String description;
    private String logoUrl;
    @NotNull(message = "Website is required")
    private String website;
    @JsonAlias({"isActive", "active","is_active","status"})
    private Boolean isActive;
    @JsonAlias({"createdAt", "created_at"})
    private LocalDateTime createdAt;
    @JsonAlias({"updatedAt", "updated_at"})
    private LocalDateTime updatedAt;
}
