package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.dto.ProductVariantDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductVariantService {
    Page<ProductVariantDto> getVariantsByProductId(UUID productId, Pageable pageable);
    ProductVariantDto getVariantById(UUID id);
    ProductVariantDto getVariantBySku(String sku);
    ProductVariantDto createVariant(ProductVariantCreateDto createDto);
    ProductVariantDto updateVariant(UUID id, ProductVariantDto variantDto);
    void deleteVariant(UUID id);
}