package com.ainan.ecommforallbackend.domain.product.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ainan.ecommforallbackend.domain.order.dto.ImageSortOrderDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {
    Page<ProductImageDto> getImagesByProductId(UUID productId, Pageable pageable);
    ProductImageDto getImageById(UUID id);
    ProductImageDto createImage(ProductImageCreateDto createDto);
    ProductImageDto updateImage(UUID id, ProductImageDto imageDto);
    void deleteImage(UUID id);

    List<ProductImageDto> updateImagesOrder(UUID productId, List<ImageSortOrderDto> imageOrders);
}