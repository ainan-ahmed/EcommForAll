package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.dto.BrandDto;
import com.ainan.ecommforallbackend.service.BrandService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/brands")
//@PreAuthorize("hasRole('Seller')")
@AllArgsConstructor
public class BrandController {
    private final BrandService brandService;
    @GetMapping
    public ResponseEntity<Page<BrandDto>> getAllBrands(Pageable pageable) {
        Page<BrandDto> brands = brandService.getAllBrands(pageable);
        return ResponseEntity.ok(brands);
    }
    @GetMapping("/active")
    public ResponseEntity<Page<BrandDto>> getAllActiveBrands(Pageable pageable) {
        Page<BrandDto> brands = brandService.getAllActiveBrands(pageable);
        return ResponseEntity.ok(brands);
    }
    @GetMapping("/{id}")
    public ResponseEntity<BrandDto> getBrandById(@PathVariable UUID id) {
        BrandDto brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }
    @PostMapping
    public ResponseEntity<BrandDto> createBrand(@RequestBody BrandCreateDto brandDto) {
        BrandDto createdBrand = brandService.createBrand(brandDto);
        return new ResponseEntity<>(createdBrand,HttpStatus.CREATED);
    }
//    @GetMapping("/{name}")
//    public ResponseEntity<BrandDto> getBrandByName(@PathVariable String name) {
//        BrandDto brand = brandService.getBrandByName(name);
//        return ResponseEntity.ok(brand);
//    }
    @PutMapping("/{id}")
    public ResponseEntity<BrandDto> updateBrand(@PathVariable UUID id, @RequestBody BrandDto brandDto) {
        BrandDto updatedBrand = brandService.updateBrand(id, brandDto);
        return ResponseEntity.ok(updatedBrand);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable UUID id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }


}
