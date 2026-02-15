package com.ainan.ecommforallbackend.domain.brand.controller;


import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.service.BrandService;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;

@RestController
@RequestMapping("/api/brands")
@AllArgsConstructor
@Tag(name = "Brands", description = "Brand catalog management and media")
public class BrandController {
    private final BrandService brandService;
    private final S3Service s3Service;

    @GetMapping
    @Operation(summary = "List brands", description = "Returns paginated brands with optional filtering provided by the service.")
    public ResponseEntity<Page<BrandDto>> getAllBrands(Pageable pageable) {
        Page<BrandDto> brands = brandService.getAllBrands(pageable);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/active")
    @Operation(summary = "List active brands", description = "Returns only brands marked as active.")
    public ResponseEntity<Page<BrandDto>> getAllActiveBrands(Pageable pageable) {
        Page<BrandDto> brands = brandService.getAllActiveBrands(pageable);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID", description = "Returns brand details for the given brand ID.")
    public ResponseEntity<BrandDto> getBrandById(@PathVariable UUID id) {
        BrandDto brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get brand by name", description = "Finds a brand by its unique name.")
    public ResponseEntity<BrandDto> getBrandByName(@PathVariable String name) {
        BrandDto brand = brandService.getBrandByName(name);
        return ResponseEntity.ok(brand);
    }

    @PostMapping
    @Operation(summary = "Create brand", description = "Creates a new brand entry.")
    public ResponseEntity<BrandDto> createBrand(@RequestBody BrandCreateDto brandCreateDto) {

        BrandDto createdBrand = brandService.createBrand(brandCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBrand);
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload brand image", description = "Uploads a brand image to S3 and updates the brand record.")
    public ResponseEntity<BrandDto> uploadBrandImage(
            @PathVariable UUID id,
            @RequestPart("image") MultipartFile image) {
        BrandDto brandDto = brandService.getBrandById(id);

        // Delete old-image if it exists
        if (brandDto.getImageUrl() != null) {
            s3Service.deleteFile(brandDto.getImageUrl());
        }

        // Upload new image
        try {
            String imageUrl = s3Service.uploadFile(image, "brands");
            brandDto.setImageUrl(imageUrl);
            BrandDto updatedBrand = brandService.updateBrand(id, brandDto);
            return ResponseEntity.ok(updatedBrand);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update brand", description = "Updates brand details by ID.")
    public ResponseEntity<BrandDto> updateBrand(
            @PathVariable UUID id,
            @RequestBody BrandDto brandDto) {

        BrandDto updatedBrand = brandService.updateBrand(id, brandDto);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping("/{id}/image")
    @Operation(summary = "Delete brand image", description = "Removes the brand image and clears the image URL.")
    public ResponseEntity<BrandDto> deleteBrandImage(@PathVariable UUID id) {
        BrandDto brandDto = brandService.getBrandById(id);

        // Delete the image if it exists
        if (brandDto.getImageUrl() != null) {
            s3Service.deleteFile(brandDto.getImageUrl());
            brandDto.setImageUrl(null);
            BrandDto updatedBrand = brandService.updateBrand(id, brandDto);
            return ResponseEntity.ok(updatedBrand);
        }

        return ResponseEntity.ok(brandDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete brand", description = "Deletes a brand and removes the image if present.")
    public ResponseEntity<Void> deleteBrand(@PathVariable UUID id) {
        String imageUrl = brandService.getBrandById(id).getImageUrl();
        if (imageUrl != null) {
            s3Service.deleteFile(imageUrl);
        }
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}
