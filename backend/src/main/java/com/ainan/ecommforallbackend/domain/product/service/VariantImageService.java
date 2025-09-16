package com.ainan.ecommforallbackend.domain.product.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ainan.ecommforallbackend.domain.product.dto.VariantImageCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.VariantImageDto;
import java.util.UUID;

public interface VariantImageService {
    Page<VariantImageDto> getImagesByVariantId(UUID variantId, Pageable pageable);

    VariantImageDto getImageById(UUID id);

    VariantImageDto createImage(VariantImageCreateDto createDto);

    VariantImageDto updateImage(UUID id, VariantImageDto imageDto);

    void deleteImage(UUID id);
}