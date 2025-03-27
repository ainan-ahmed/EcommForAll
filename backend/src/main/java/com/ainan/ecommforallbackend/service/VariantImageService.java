package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.VariantImageCreateDto;
import com.ainan.ecommforallbackend.dto.VariantImageDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface VariantImageService {
    Page<VariantImageDto> getImagesByVariantId(UUID variantId, Pageable pageable);
    VariantImageDto getImageById(UUID id);
    VariantImageDto createImage(VariantImageCreateDto createDto);
    VariantImageDto updateImage(UUID id, VariantImageDto imageDto);
    void deleteImage(UUID id);
}