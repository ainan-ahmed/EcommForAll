package com.ainan.ecommforallbackend.domain.brand.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;

import java.util.UUID;

public interface BrandService {
    // Add brand-specific operations here
    Page<BrandDto> getAllBrands(Pageable pageable);
    Page<BrandDto> getAllActiveBrands(Pageable pageable);
    BrandDto getBrandById(UUID id);
    BrandDto getBrandByName(String name);
    BrandDto createBrand(BrandCreateDto brandDto);
    BrandDto updateBrand(UUID id, BrandDto brandDto);
    void deleteBrand(UUID id);

}
