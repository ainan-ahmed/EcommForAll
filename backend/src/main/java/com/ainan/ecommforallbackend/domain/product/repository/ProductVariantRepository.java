package com.ainan.ecommforallbackend.domain.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.product.entity.ProductVariant;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    Page<ProductVariant> findByProductId(UUID productId, Pageable pageable);
    Optional<ProductVariant> findBySku(String sku);
    void deleteByProductId(UUID productId);
    @Query("SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = :productId")
    Optional<BigDecimal> findMinPriceByProductId(@Param("productId") UUID productId);
}