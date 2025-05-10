package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.ProductImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    Page<ProductImage> findByProductIdOrderBySortOrderAsc(UUID productId, Pageable pageable);
    void deleteByProductId(UUID productId);
}