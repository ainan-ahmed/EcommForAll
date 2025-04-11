package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.dto.BrandDto;
import com.ainan.ecommforallbackend.entity.Brand;
import com.ainan.ecommforallbackend.mapper.BrandMapper;
import com.ainan.ecommforallbackend.repository.BrandRepository;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    @Override
    @Cacheable(value = "brands", key = "'allBrands' + #pageable")
    public Page<BrandDto> getAllBrands(Pageable pageable) {
        return brandRepository.findAll(pageable).map(BrandMapper.INSTANCE::BrandToBrandDto);
    }

    @Override
    @Cacheable(value = "brands", key = "'allActiveBrands' + #pageable")
    public Page<BrandDto> getAllActiveBrands(Pageable pageable) {
        return brandRepository.findByIsActiveTrue(pageable).map(BrandMapper.INSTANCE::BrandToBrandDto);
    }

    @Override
    @Cacheable(value = "brands", key = "'brandById' + #id")
    public BrandDto getBrandById(UUID id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: "+ id));
        return BrandMapper.INSTANCE.BrandToBrandDto(brand);
    }
    @Override
    @Cacheable(value = "brands", key = "'brandByName' + #name")
    public BrandDto getBrandByName(String name) {
        Brand brand = brandRepository.findByNameIgnoreCase(name).orElseThrow(() -> new RuntimeException("Brand not found with name: "+ name));
        return BrandMapper.INSTANCE.BrandToBrandDto(brand);
    }

    @Override
    @Transactional
    @CacheEvict(value = "brands", allEntries = true)
    public BrandDto createBrand(BrandCreateDto brandDto) {
        if(brandRepository.findByNameIgnoreCase(brandDto.getName()).isPresent()){
            throw new RuntimeException("Brand already exists with name: "+ brandDto.getName());
        };
        Brand brand = BrandMapper.INSTANCE.BrandCreateDtoToBrand(brandDto);
        brand.setIsActive(true);
        Brand savedBrand = brandRepository.save(brand);
        return BrandMapper.INSTANCE.BrandToBrandDto(savedBrand);
    }

    @Override
    @Transactional
    @CacheEvict(value = "brands", allEntries = true)
    public BrandDto updateBrand(UUID id, BrandDto brandDto) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: "+ id));
        if(!brand.getName().equalsIgnoreCase(brandDto.getName()) &&brandRepository.findByNameIgnoreCase(brandDto.getName()).isPresent()){
            throw new RuntimeException("Brand already exists with name: "+ brandDto.getName());
        };
        BrandMapper.INSTANCE.BrandDtoToBrand(brandDto,brand);
        Brand updatedBrand = brandRepository.save(brand);
        return BrandMapper.INSTANCE.BrandToBrandDto(updatedBrand);
    }

    @Override
    @Transactional
    @CacheEvict(value = "brands", allEntries = true)
    public void deleteBrand(UUID id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: "+ id));
        brand.setIsActive(false);
        brandRepository.save(brand);
    }
}
