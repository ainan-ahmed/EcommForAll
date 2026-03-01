package com.ainan.ecommforallbackend.domain.category.service;

import com.ainan.ecommforallbackend.domain.category.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.entity.Category;
import com.ainan.ecommforallbackend.domain.category.mapper.CategoryMapper;
import com.ainan.ecommforallbackend.domain.category.repository.CategoryRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryServiceImpl Unit Tests")
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;
    private CategoryDto categoryDto;
    private CategoryCreateDto categoryCreateDto;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        categoryId = UUID.randomUUID();
        category = new Category();
        category.setId(categoryId);
        category.setName("Electronics");
        category.setSlug("electronics");
        category.setDescription("Electronic items");
        category.setImageUrl("http://example.com/img.jpg");
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());

        // CategoryDto(UUID id, String name, String imageUrl, String slug, String fullSlug, String description, UUID parent, List<UUID> subCategories, Integer productCount)
        categoryDto = new CategoryDto(
                categoryId,
                "Electronics",
                "http://example.com/img.jpg",
                "electronics",
                "electronics",
                "Electronic items",
                null,
                Collections.emptyList(),
                10
        );

        categoryCreateDto = new CategoryCreateDto("Electronics", null, "Electronic items", "http://example.com/img.jpg");
    }

    @Nested
    @DisplayName("getAllCategories()")
    class GetAllCategories {
        @Test
        @DisplayName("returns page of category dtos")
        void returnsPageOfCategoryDtos() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Category> page = new PageImpl<>(Collections.singletonList(category));

            given(categoryRepository.findAll(pageable)).willReturn(page);
            given(categoryMapper.mapWithSubCategories(eq(category), any(ProductRepository.class))).willReturn(categoryDto);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            Page<CategoryDto> result = categoryService.getAllCategories(pageable);

            assertThat(result).isNotEmpty();
            assertThat(result.getContent().get(0).getName()).isEqualTo("Electronics");
            assertThat(result.getContent().get(0).getImageUrl()).isEqualTo("presigned-url");
        }
    }

    @Nested
    @DisplayName("getCategoryById()")
    class GetCategoryById {
        @Test
        @DisplayName("returns category dto when found")
        void returnsCategoryDtoWhenFound() {
            given(categoryRepository.findById(categoryId)).willReturn(Optional.of(category));
            given(categoryMapper.mapWithSubCategories(eq(category), any(ProductRepository.class))).willReturn(categoryDto);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            CategoryDto result = categoryService.getCategoryById(categoryId);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Electronics");
        }

        @Test
        @DisplayName("throws exception when not found")
        void throwsExceptionWhenNotFound() {
            given(categoryRepository.findById(categoryId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> categoryService.getCategoryById(categoryId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Category not found");
        }
    }

    @Nested
    @DisplayName("createCategory()")
    class CreateCategory {
        @Test
        @DisplayName("creates and returns category dto")
        void createsAndReturnsCategoryDto() {
            given(categoryRepository.findByNameIgnoreCase(categoryCreateDto.getName())).willReturn(Optional.empty());
            given(categoryMapper.categoryCreateDtoToCategory(categoryCreateDto)).willReturn(category);
            // findBySlug check for uniqueness
            given(categoryRepository.findBySlug(anyString())).willReturn(Optional.empty());
            
            given(categoryRepository.save(any(Category.class))).willReturn(category);
            given(categoryMapper.categoryToCategoryDto(category)).willReturn(categoryDto);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            CategoryDto result = categoryService.createCategory(categoryCreateDto);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Electronics");
            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("throws exception when name exists")
        void throwsExceptionWhenNameExists() {
            given(categoryRepository.findByNameIgnoreCase(categoryCreateDto.getName())).willReturn(Optional.of(category));

            assertThatThrownBy(() -> categoryService.createCategory(categoryCreateDto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Category already exists");

            verify(categoryRepository, never()).save(any(Category.class));
        }
    }

    @Nested
    @DisplayName("updateCategory()")
    class UpdateCategory {
        @Test
        @DisplayName("updates and returns category dto")
        void updatesAndReturnsCategoryDto() {
            CategoryDto updateDto = new CategoryDto(categoryId, "Updated", "img", "updated", "updated", "desc", null, null, 0);
            
            given(categoryRepository.findById(categoryId)).willReturn(Optional.of(category));
            // No name conflict
            given(categoryRepository.findByNameIgnoreCase("Updated")).willReturn(Optional.empty());
            // No slug conflict
            given(categoryRepository.findBySlug("updated")).willReturn(Optional.empty());
            
            willDoNothing().given(categoryMapper).categoryDtoToCategory(eq(updateDto), any(Category.class));
            given(categoryRepository.save(any(Category.class))).willReturn(category);
            given(categoryMapper.mapWithSubCategories(eq(category), any(ProductRepository.class))).willReturn(updateDto);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            CategoryDto result = categoryService.updateCategory(categoryId, updateDto);

            assertThat(result.getName()).isEqualTo("Updated");
            verify(categoryRepository).save(category);
        }
    }

    @Nested
    @DisplayName("deleteCategory()")
    class DeleteCategory {
        @Test
        @DisplayName("deletes category")
        void deletesCategory() {
            given(categoryRepository.findById(categoryId)).willReturn(Optional.of(category));
            willDoNothing().given(categoryRepository).setChildrenParentToNull(categoryId);
            willDoNothing().given(categoryRepository).delete(category);

            categoryService.deleteCategory(categoryId);

            verify(categoryRepository).delete(category);
        }
    }
}
