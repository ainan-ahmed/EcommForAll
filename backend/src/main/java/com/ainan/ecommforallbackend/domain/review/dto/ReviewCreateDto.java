package com.ainan.ecommforallbackend.domain.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Data
@RequiredArgsConstructor
public class ReviewCreateDto {
    @NotNull(message = "Review's product ID cannot be null.")
    private UUID productId;

    @NotNull(message = "Review's user ID cannot be null.")
    private UUID userId;
    @NotNull(message = "Review's title cannot be null.")
    private String title;

    @NotNull(message = "Review's rating cannot be null.")
    @Min(1)
    @Max(5)
    private int rating;
    @NotNull(message = "Review's comment cannot be null.")
    private String comment;

}
