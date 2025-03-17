package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.dto.BrandDto;
import com.ainan.ecommforallbackend.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
