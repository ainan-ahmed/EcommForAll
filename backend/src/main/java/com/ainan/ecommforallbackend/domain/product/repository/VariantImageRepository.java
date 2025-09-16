package com.ainan.ecommforallbackend.domain.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.product.entity.VariantImage;

import java.util.UUID;

@Repository
public interface VariantImageRepository extends JpaRepository<VariantImage, UUID> {
    Page<VariantImage> findByVariantId(UUID variantId, Pageable pageable);
    void deleteByVariantId(UUID variantId);
}