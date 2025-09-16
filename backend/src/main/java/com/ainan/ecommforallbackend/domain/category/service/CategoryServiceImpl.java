package com.ainan.ecommforallbackend.domain.category.service;

import com.ainan.ecommforallbackend.core.util.SlugUtil;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.entity.Category;
import com.ainan.ecommforallbackend.domain.category.mapper.CategoryMapper;
import com.ainan.ecommforallbackend.domain.category.repository.CategoryRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductRepository productRepository;
    private final S3Service s3Service;

    @Override
    @Cacheable(value = "categories", key = "'allCategories' + #pageable")
    public Page<CategoryDto> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(category -> {
                    CategoryDto dto = categoryMapper.mapWithSubCategories(category, productRepository);
                    return convertImageToPresignedUrl(dto);
                });
    }

    @Override
    @Cacheable(value = "categories", key = "'rootCategories' + #pageable")
    public Page<CategoryDto> getRootCategories(Pageable pageable) {
        return categoryRepository.findByParentIsNull(pageable)
                .map(category -> {
                    CategoryDto categoryDto = categoryMapper.mapWithSubCategories(category, productRepository);
                    return convertImageToPresignedUrl(categoryDto);
                });
    }

    @Override
    @Cacheable(value = "categories", key = "'category' + #id")
    public CategoryDto getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        CategoryDto dto = categoryMapper.mapWithSubCategories(category, productRepository);
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Cacheable(value = "categories", key = "'categoryBySlug' + #slug")
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
        CategoryDto dto = categoryMapper.mapWithSubCategories(category, productRepository);
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Cacheable(value = "categories", key = "'categoryByName' + #name")
    public CategoryDto getCategoryByName(String name) {
        Category category = categoryRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
        CategoryDto dto = categoryMapper.mapWithSubCategories(category, productRepository);
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto createCategory(CategoryCreateDto categoryCreateDto) {
        if (categoryRepository.findByNameIgnoreCase(categoryCreateDto.getName()).isPresent()) {
            throw new RuntimeException("Category already exists with name: " + categoryCreateDto.getName());
        }
        Category category = categoryMapper.categoryCreateDtoToCategory(categoryCreateDto);
        if (categoryCreateDto.getParent() != null) {
            Category parentCategory = categoryRepository.findById(categoryCreateDto.getParent()).orElseThrow(() -> new RuntimeException("Parent category not found with id: " + categoryCreateDto.getParent()));
            category.setParent(parentCategory);
        }
        else{
            category.setParent(null);
        }
        String generatedSlug = SlugUtil.toSlug(categoryCreateDto.getName());
        int counter = 1;
        String uniqueSlug = generatedSlug;
        while (categoryRepository.findBySlug(uniqueSlug).isPresent()) {
            uniqueSlug = generatedSlug + "-" + counter++;
        }
        category.setSlug(uniqueSlug);
        Category savedCategory = categoryRepository.save(category);
        CategoryDto categoryDto = categoryMapper.categoryToCategoryDto(savedCategory);
        return convertImageToPresignedUrl(categoryDto);
    }

    @Override
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto updateCategory(UUID id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        if (!category.getName().equalsIgnoreCase(categoryDto.getName()) && categoryRepository.findByNameIgnoreCase(categoryDto.getName()).isPresent()) {
            throw new RuntimeException("Category already exists with name: " + categoryDto.getName());
        }
        if (!category.getSlug().equalsIgnoreCase(categoryDto.getSlug()) && categoryRepository.findBySlug(categoryDto.getSlug()).isPresent()) {
            throw new RuntimeException("Category already exists with slug: " + categoryDto.getSlug());
        }
        categoryMapper.categoryDtoToCategory(categoryDto, category);
        if (categoryDto.getParent() != null) {
            if (categoryDto.getParent().equals(id)) {
                throw new RuntimeException("Category cannot be its own parent");
            }
            Category parentCategory = categoryRepository.findById(categoryDto.getParent()).orElseThrow(() -> new RuntimeException("Parent category not found with id: " + categoryDto.getParent()));
            category.setParent(parentCategory);
        }
        else{
            category.setParent(null);
        }
        Category updatedCategory = categoryRepository.save(category);
        CategoryDto dto = categoryMapper.mapWithSubCategories(updatedCategory, productRepository);
        return convertImageToPresignedUrl(dto);
    }

    @Override
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        categoryRepository.setChildrenParentToNull(category.getId());
        categoryRepository.delete(category);

    }
    private CategoryDto convertImageToPresignedUrl(CategoryDto categoryDto) {
        if (categoryDto != null && categoryDto.getImageUrl() != null) {
            String imageUrl = categoryDto.getImageUrl();
            URI uri = URI.create(imageUrl);
            String key = uri.getPath();
            if (key.startsWith("/")) {
                key = key.substring(1);
            }

            // Generate a pre-signed URL with 1-hour expiration
            String presignedUrl = s3Service.generatePresignedDownloadUrl(key, 60);
            categoryDto.setImageUrl(presignedUrl);
        }
        return categoryDto;
    }
}
