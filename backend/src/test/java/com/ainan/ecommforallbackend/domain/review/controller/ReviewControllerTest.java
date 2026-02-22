package com.ainan.ecommforallbackend.domain.review.controller;

import com.ainan.ecommforallbackend.domain.review.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewDto;
import com.ainan.ecommforallbackend.domain.review.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReviewController Unit Tests")
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private ReviewDto reviewDto;
    private ReviewCreateDto reviewCreateDto;
    private UUID reviewId;
    private UUID productId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        reviewId = UUID.randomUUID();
        productId = UUID.randomUUID();
        userId = UUID.randomUUID();

        reviewDto = new ReviewDto();
        reviewDto.setId(reviewId);
        reviewDto.setProductId(productId);
        reviewDto.setUserId(userId);
        reviewDto.setTitle("Great Product");
        reviewDto.setComment("Loved it!");
        reviewDto.setRating(5);
        reviewDto.setCreatedAt(LocalDateTime.now());
        reviewDto.setUpdatedAt(LocalDateTime.now());

        reviewCreateDto = new ReviewCreateDto();
        reviewCreateDto.setProductId(productId);
        reviewCreateDto.setUserId(userId);
        reviewCreateDto.setTitle("Great Product");
        reviewCreateDto.setComment("Loved it!");
        reviewCreateDto.setRating(5);
    }

    @Nested
    @DisplayName("GET /api/review/{productId}/reviews")
    class GetAllReviewsByProductId {
        @Test
        @DisplayName("returns 200 with page of reviews")
        void returns200WithPageOfReviews() throws Exception {
            Page<ReviewDto> page = new PageImpl<>(Collections.singletonList(reviewDto), PageRequest.of(0, 10), 1);
            given(reviewService.getReviewsByProductId(eq(productId), any(Pageable.class))).willReturn(page);

            mockMvc.perform(get("/api/review/{productId}/reviews", productId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].title").value("Great Product"));
        }
    }

    @Nested
    @DisplayName("GET /api/review/review/{id}")
    class GetReviewById {
        @Test
        @DisplayName("returns 200 with review")
        void returns200WithReview() throws Exception {
            given(reviewService.getReviewById(reviewId)).willReturn(reviewDto);

            mockMvc.perform(get("/api/review/review/{id}", reviewId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.title").value("Great Product"));
        }
    }

    @Nested
    @DisplayName("POST /api/review/review/create")
    class CreateReview {
        @Test
        @DisplayName("returns 201 with created review")
        void returns201WithCreatedReview() throws Exception {
            given(reviewService.createReview(any(ReviewCreateDto.class))).willReturn(reviewDto);

            mockMvc.perform(post("/api/review/review/create")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(reviewCreateDto)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.title").value("Great Product"));
        }
    }

    @Nested
    @DisplayName("DELETE /api/review/review/{id}")
    class DeleteReviewById {
        @Test
        @DisplayName("returns 204 no content")
        void returns204NoContent() throws Exception {
            willDoNothing().given(reviewService).deleteReviewById(reviewId);

            mockMvc.perform(delete("/api/review/review/{id}", reviewId))
                    .andExpect(status().isNoContent());

            verify(reviewService).deleteReviewById(reviewId);
        }
    }
}
