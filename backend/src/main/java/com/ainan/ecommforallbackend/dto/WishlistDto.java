package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDto {

    private UUID id;
    @NotNull(message = "Name is required")
    private String name;
    private UUID userId;
    private Set<WishlistProductSummeryDto> products;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}