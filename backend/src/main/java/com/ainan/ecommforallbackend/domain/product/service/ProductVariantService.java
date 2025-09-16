package com.ainan.ecommforallbackend.domain.product.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;

import java.util.UUID;

public interface ProductVariantService {
    Page<ProductVariantDto> getVariantsByProductId(UUID productId, Pageable pageable);
    ProductVariantDto getVariantById(UUID id);
    ProductVariantDto getVariantBySku(String sku);
    ProductVariantDto createVariant(ProductVariantCreateDto createDto);
    ProductVariantDto updateVariant(UUID id, ProductVariantDto variantDto);
    void deleteVariant(UUID id);
    void updateProductPrice(UUID productId);
}