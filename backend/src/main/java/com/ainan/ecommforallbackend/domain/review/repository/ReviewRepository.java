package com.ainan.ecommforallbackend.domain.review.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ainan.ecommforallbackend.domain.review.entity.Review;

import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    void deleteByProductId(UUID productId);

    void deleteByUserId(UUID userId);

    Page<Review> findAllByProductId(Pageable pageable, UUID productId);
}
