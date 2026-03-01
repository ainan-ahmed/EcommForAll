package com.ainan.ecommforallbackend.domain.review.service;

import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewDto;
import com.ainan.ecommforallbackend.domain.review.entity.Review;
import com.ainan.ecommforallbackend.domain.review.repository.ReviewRepository;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doNothing;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReviewService Unit Tests")
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review review;
    private User user;
    private Product product;
    private ReviewCreateDto reviewCreateDto;
    private UUID reviewId;
    private UUID userId;
    private UUID productId;

    @BeforeEach
    void setUp() {
        reviewId = UUID.randomUUID();
        userId = UUID.randomUUID();
        productId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setUsername("testuser");

        product = new Product();
        product.setId(productId);
        product.setName("Test Product");

        review = new Review();
        review.setId(reviewId);
        review.setUser(user);
        review.setProduct(product);
        review.setRating(5);
        review.setTitle("Great product");
        review.setComment("I loved it!");
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        reviewCreateDto = new ReviewCreateDto();
        reviewCreateDto.setUserId(userId);
        reviewCreateDto.setProductId(productId);
        reviewCreateDto.setRating(5);
        reviewCreateDto.setTitle("Great product");
        reviewCreateDto.setComment("I loved it!");
    }

    @Nested
    @DisplayName("getReviewById()")
    class GetReviewById {
        @Test
        @DisplayName("returns review dto when found")
        void returnsReviewDtoWhenFound() {
            given(reviewRepository.findById(reviewId)).willReturn(Optional.of(review));

            ReviewDto result = reviewService.getReviewById(reviewId);

            assertThat(result).isNotNull();
            assertThat(result.getTitle()).isEqualTo("Great product");
            assertThat(result.getRating()).isEqualTo(5);
        }

        @Test
        @DisplayName("throws exception when not found")
        void throwsExceptionWhenNotFound() {
            given(reviewRepository.findById(reviewId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> reviewService.getReviewById(reviewId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Review not found");
        }
    }

    @Nested
    @DisplayName("getReviewsByProductId()")
    class GetReviewsByProductId {
        @Test
        @DisplayName("returns page of review dtos")
        void returnsPageOfReviewDtos() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Review> page = new PageImpl<>(Collections.singletonList(review));

            given(reviewRepository.findAllByProductId(pageable, productId)).willReturn(page);

            Page<ReviewDto> result = reviewService.getReviewsByProductId(productId, pageable);

            assertThat(result).isNotEmpty();
            assertThat(result.getContent().get(0).getTitle()).isEqualTo("Great product");
        }
    }

    @Nested
    @DisplayName("createReview()")
    class CreateReview {
        @Test
        @DisplayName("creates and returns review dto")
        void createsAndReturnsReviewDto() {
            given(userRepository.findById(userId)).willReturn(Optional.of(user));
            given(productRepository.findById(productId)).willReturn(Optional.of(product));
            given(reviewRepository.save(any(Review.class))).willReturn(review);

            ReviewDto result = reviewService.createReview(reviewCreateDto);

            assertThat(result).isNotNull();
            assertThat(result.getTitle()).isEqualTo("Great product");
            verify(reviewRepository).save(any(Review.class));
        }

        @Test
        @DisplayName("throws exception when user not found")
        void throwsExceptionWhenUserNotFound() {
            given(userRepository.findById(userId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> reviewService.createReview(reviewCreateDto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");
        }

        @Test
        @DisplayName("throws exception when product not found")
        void throwsExceptionWhenProductNotFound() {
            given(userRepository.findById(userId)).willReturn(Optional.of(user));
            given(productRepository.findById(productId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> reviewService.createReview(reviewCreateDto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Product not found");
        }
    }

    @Nested
    @DisplayName("deleteReviewById()")
    class DeleteReviewById {
        @Test
        @DisplayName("deletes review")
        void deletesReview() {
            doNothing().when(reviewRepository).deleteById(reviewId);

            reviewService.deleteReviewById(reviewId);

            verify(reviewRepository).deleteById(reviewId);
        }
    }
}
