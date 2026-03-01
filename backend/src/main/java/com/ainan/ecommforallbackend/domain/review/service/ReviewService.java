package com.ainan.ecommforallbackend.domain.review.service;

import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.domain.review.dto.ReviewDto;
import com.ainan.ecommforallbackend.domain.review.entity.Review;
import com.ainan.ecommforallbackend.domain.review.mapper.ReviewMapper;
import com.ainan.ecommforallbackend.domain.review.repository.ReviewRepository;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public ReviewDto getReviewById(UUID id) {
        return reviewRepository.findById(id)
                .map(ReviewMapper.INSTANCE::toDto)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsByProductId(UUID productId, Pageable pageable) {
        return reviewRepository.findAllByProductId(pageable, productId).map(ReviewMapper.INSTANCE::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDto> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(ReviewMapper.INSTANCE::toDto);
    }

    @Transactional
    public ReviewDto createReview(ReviewCreateDto reviewCreateDto) {
        Review newReview = ReviewMapper.INSTANCE.ReviewCreateDtoToReview(reviewCreateDto);
        User user = userRepository.findById(reviewCreateDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + reviewCreateDto.getUserId()));
        Product product = productRepository.findById(reviewCreateDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + reviewCreateDto.getProductId()));
        newReview.setUser(user);
        newReview.setProduct(product);
        return ReviewMapper.INSTANCE.toDto(reviewRepository.save(newReview));
    }

    public void deleteReviewById(UUID id) {
        reviewRepository.deleteById(id);
    }


}
