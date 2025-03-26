package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findBySku(String sku);
    Page<Product> findByIsActive(Boolean isActive, Pageable pageable);
    Page<Product> findByIsFeatured(Boolean isFeatured, Pageable pageable);
    Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);
    Page<Product> findBySellerId(UUID sellerId, Pageable pageable);
    Page<Product> findByBrandId(UUID brandId, Pageable pageable);
    Optional<Product> findBySkuAndSellerIdAndIsActive(String sku, UUID sellerId, Boolean isActive);
}
