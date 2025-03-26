package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.VariantImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantImageRepository extends JpaRepository<VariantImage, UUID> {
    Page<VariantImage> findByVariantId(UUID variantId, Pageable pageable);
    void deleteByVariantId(UUID variantId);
}