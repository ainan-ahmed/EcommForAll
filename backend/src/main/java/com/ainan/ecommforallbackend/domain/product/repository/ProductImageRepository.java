package com.ainan.ecommforallbackend.domain.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.product.entity.ProductImage;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    Page<ProductImage> findByProductIdOrderBySortOrderAsc(UUID productId, Pageable pageable);
    void deleteByProductId(UUID productId);
}