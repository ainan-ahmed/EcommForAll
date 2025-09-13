package com.ainan.ecommforallbackend.domain.brand.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.entity.Brand;
import com.ainan.ecommforallbackend.domain.brand.mapper.BrandMapper;
import com.ainan.ecommforallbackend.domain.brand.repository.BrandRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;

import java.net.URI;
import java.util.UUID;

@Service
@AllArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final S3Service s3Service;

    @Override
    public Page<BrandDto> getAllBrands(Pageable pageable) {
        return brandRepository.findAll(pageable)
                .map(brand -> {
                    BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(brand);
                    dto.setProductCount((int) productRepository.countByBrandId(dto.getId()));
                    return convertImageToPresignedUrl(dto);
                });
    }

    @Override
    public Page<BrandDto> getAllActiveBrands(Pageable pageable) {
        return brandRepository.findByIsActiveTrue(pageable)
                .map(brand -> {
                    BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(brand);
                    dto.setProductCount((int) productRepository.countByBrandId(dto.getId()));
                    return convertImageToPresignedUrl(dto);
                });
    }

    @Override
    public BrandDto getBrandById(UUID id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(brand);
        dto.setProductCount((int) productRepository.countByBrandId(id));
        return convertImageToPresignedUrl(dto);
    }

    @Override
    public BrandDto getBrandByName(String name) {
        Brand brand = brandRepository.findByNameIgnoreCase(name).orElseThrow(() -> new RuntimeException("Brand not found with name: " + name));
        BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(brand);
        dto.setProductCount((int) productRepository.countByBrandId(brand.getId()));
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Transactional
    public BrandDto createBrand(BrandCreateDto brandDto) {
        if (brandRepository.findByNameIgnoreCase(brandDto.getName()).isPresent()) {
            throw new RuntimeException("Brand already exists with name: " + brandDto.getName());
        }
        ;
        Brand brand = BrandMapper.INSTANCE.BrandCreateDtoToBrand(brandDto);
        brand.setIsActive(true);
        Brand savedBrand = brandRepository.save(brand);
        BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(savedBrand);
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Transactional
    public BrandDto updateBrand(UUID id, BrandDto brandDto) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        if (!brand.getName().equalsIgnoreCase(brandDto.getName()) && brandRepository.findByNameIgnoreCase(brandDto.getName()).isPresent()) {
            throw new RuntimeException("Brand already exists with name: " + brandDto.getName());
        }
        ;
        BrandMapper.INSTANCE.BrandDtoToBrand(brandDto, brand);
        Brand updatedBrand = brandRepository.save(brand);
        BrandDto dto = BrandMapper.INSTANCE.BrandToBrandDto(updatedBrand);

        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Transactional
    public void deleteBrand(UUID id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        brand.setIsActive(false);
        brandRepository.save(brand);
    }

    private BrandDto convertImageToPresignedUrl(BrandDto brandDto) {
        if (brandDto != null && brandDto.getImageUrl() != null) {
            String imageUrl = brandDto.getImageUrl();
            URI uri = URI.create(imageUrl);
            String key = uri.getPath();
            if (key.startsWith("/")) {
                key = key.substring(1);
            }

            // Generate a pre-signed URL with 1-hour expiration
            String presignedUrl = s3Service.generatePresignedDownloadUrl(key, 60);
            brandDto.setImageUrl(presignedUrl);
        }
        return brandDto;
    }
}
