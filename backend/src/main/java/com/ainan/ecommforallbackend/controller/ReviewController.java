package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.dto.ReviewDto;
import com.ainan.ecommforallbackend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<Page<ReviewDto>> getAllReviewsByProductId(@PathVariable UUID productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId, pageable));
    }

    @GetMapping("/review/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PostMapping("/review/create")
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewCreateDto reviewCreateDto) {
        ReviewDto createdReview = reviewService.createReview(reviewCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);

    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<Void> deleteReviewById(@PathVariable UUID id) {
        reviewService.deleteReviewById(id);
        return ResponseEntity.noContent().build();
    }


}
