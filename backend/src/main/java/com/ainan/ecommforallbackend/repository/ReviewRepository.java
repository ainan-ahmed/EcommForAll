package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    void deleteByProductId(UUID productId);

    void deleteByUserId(UUID userId);

    Page<Review> findAllByProductId(Pageable pageable, UUID productId);
}
