package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.entity.ProductImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> , JpaSpecificationExecutor<Product> {
    Optional<Product> findBySku(String sku);
    Page<Product> findByIsActive(Boolean isActive, Pageable pageable);
    Page<Product> findByIsFeatured(Boolean isFeatured, Pageable pageable);
    Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);
    Page<Product> findBySellerId(UUID sellerId, Pageable pageable);
    Page<Product> findByBrandId(UUID brandId, Pageable pageable);
    Optional<Product> findBySkuAndSellerIdAndIsActive(String sku, UUID sellerId, Boolean isActive);
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    long countByCategoryId(@Param("categoryId") UUID categoryId);
    @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds")
    Page<Product> findByCategoryIdIn(@Param("categoryIds") List<UUID> categoryIds, Pageable pageable);

}
