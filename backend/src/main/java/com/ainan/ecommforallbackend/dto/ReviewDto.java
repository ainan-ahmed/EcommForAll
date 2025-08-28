package com.ainan.ecommforallbackend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@RequiredArgsConstructor
public class ReviewDto {

    private UUID id;

    @NotNull(message = "Product ID is required")
    private UUID productId;
    private UUID userId;
    @NotNull(message = "Rating is required")
    @Min(1)
    @Max(5)
    private int rating;
    @NotNull(message = "Title is required")
    private String title;
    @NotNull(message = "Comment is required")
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UserDto user;

}
