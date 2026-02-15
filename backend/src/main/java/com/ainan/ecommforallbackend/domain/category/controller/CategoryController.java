package com.ainan.ecommforallbackend.domain.category.controller;


import com.ainan.ecommforallbackend.domain.category.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.service.CategoryService;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Category taxonomy management and media")
public class CategoryController {
    private final CategoryService categoryService;
    private final S3Service s3Service;

    @GetMapping
    @Operation(summary = "List categories", description = "Returns paginated categories.")
    public ResponseEntity<Page<CategoryDto>> getAllCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategories(pageable));
    }

    @GetMapping("/root")
    @Operation(summary = "List root categories", description = "Returns top-level categories without parent.")
    public ResponseEntity<Page<CategoryDto>> getRootCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getRootCategories(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Returns category details for the given ID.")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get category by slug", description = "Finds a category by its URL-friendly slug.")
    public ResponseEntity<CategoryDto> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get category by name", description = "Finds a category by its name.")
    public ResponseEntity<CategoryDto> getCategoryByName(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getCategoryByName(name));
    }

    @PostMapping
    @Operation(summary = "Create category", description = "Creates a new category entry.")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryCreateDto categoryCreateDto) {
        CategoryDto createdCategory = categoryService.createCategory(categoryCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload category image", description = "Uploads an image to S3 and updates the category record.")
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
    @Operation(summary = "Update category", description = "Updates category details by ID.")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryDto categoryDto) {

        CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}/image")
    @Operation(summary = "Delete category image", description = "Removes the category image and clears the image URL.")
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
    @Operation(summary = "Delete category", description = "Deletes a category and removes the image if present.")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        String imageUrl = categoryService.getCategoryById(id).getImageUrl();
        if (imageUrl != null) {
            s3Service.deleteFile(imageUrl);
        }
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
