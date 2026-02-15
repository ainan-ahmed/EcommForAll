package com.ainan.ecommforallbackend.domain.review.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.review.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewDto;
import com.ainan.ecommforallbackend.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product reviews and ratings")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{productId}/reviews")
    @Operation(summary = "List product reviews", description = "Returns reviews for a product.")
    public ResponseEntity<Page<ReviewDto>> getAllReviewsByProductId(@PathVariable UUID productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId, pageable));
    }

    @GetMapping("/review/{id}")
    @Operation(summary = "Get review", description = "Returns a review by ID.")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PostMapping("/review/create")
    @Operation(summary = "Create review", description = "Creates a new review for a product.")
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewCreateDto reviewCreateDto) {
        ReviewDto createdReview = reviewService.createReview(reviewCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);

    }

    @DeleteMapping("/review/{id}")
    @Operation(summary = "Delete review", description = "Deletes a review by ID.")
    public ResponseEntity<Void> deleteReviewById(@PathVariable UUID id) {
        reviewService.deleteReviewById(id);
        return ResponseEntity.noContent().build();
    }


}
