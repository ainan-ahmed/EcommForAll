package com.ainan.ecommforallbackend.domain.category.service;

import com.ainan.ecommforallbackend.domain.category.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CategoryService {
    Page<CategoryDto> getAllCategories(Pageable pageable);
    Page<CategoryDto> getRootCategories(Pageable pageable);
    CategoryDto getCategoryById(UUID id);
    CategoryDto getCategoryBySlug(String slug);
    CategoryDto getCategoryByName(String name);
    CategoryDto createCategory(CategoryCreateDto categoryCreateDto);
    CategoryDto updateCategory(UUID id, CategoryDto categoryDto);
    void deleteCategory(UUID id);

}
