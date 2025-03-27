package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.dto.ProductImageDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {
    Page<ProductImageDto> getImagesByProductId(UUID productId, Pageable pageable);
    ProductImageDto getImageById(UUID id);
    ProductImageDto createImage(ProductImageCreateDto createDto);
    ProductImageDto updateImage(UUID id, ProductImageDto imageDto);
    void deleteImage(UUID id);
}