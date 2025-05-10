package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.dto.CategoryDto;
import com.ainan.ecommforallbackend.service.CategoryService;
import com.ainan.ecommforallbackend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final S3Service s3Service;

    @GetMapping
    public ResponseEntity<Page<CategoryDto>> getAllCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategories(pageable));
    }

    @GetMapping("/root")
    public ResponseEntity<Page<CategoryDto>> getRootCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getRootCategories(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryDto> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<CategoryDto> getCategoryByName(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getCategoryByName(name));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryCreateDto categoryCreateDto) {
        CategoryDto createdCategory = categoryService.createCategory(categoryCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> uploadCategoryImage(
            @PathVariable UUID id,
            @RequestPart("image") MultipartFile image) {

        CategoryDto categoryDto = categoryService.getCategoryById(id);

        // Delete old image if it exists
        if (categoryDto.getImageUrl() != null) {
            s3Service.deleteFile(categoryDto.getImageUrl());
        }

        // Upload new image
        try {
            String imageUrl = s3Service.uploadFile(image, "categories");
            categoryDto.setImageUrl(imageUrl);
            CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryDto categoryDto) {

        CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<CategoryDto> deleteCategoryImage(@PathVariable UUID id) {
        CategoryDto categoryDto = categoryService.getCategoryById(id);

        // Delete the image if it exists
        if (categoryDto.getImageUrl() != null) {
            s3Service.deleteFile(categoryDto.getImageUrl());
            categoryDto.setImageUrl(null);
            CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
            return ResponseEntity.ok(updatedCategory);
        }

        return ResponseEntity.ok(categoryDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        String imageUrl = categoryService.getCategoryById(id).getImageUrl();
        if (imageUrl != null) {
            s3Service.deleteFile(imageUrl);
        }
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}