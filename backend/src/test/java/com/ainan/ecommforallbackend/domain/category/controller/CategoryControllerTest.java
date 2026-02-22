package com.ainan.ecommforallbackend.domain.category.controller;

import com.ainan.ecommforallbackend.domain.category.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.service.CategoryService;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryController Unit Tests")
class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CategoryController categoryController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private CategoryDto categoryDto;
    private CategoryCreateDto categoryCreateDto;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(categoryController)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        categoryId = UUID.randomUUID();
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
    @DisplayName("GET /api/categories")
    class GetAllCategories {
        @Test
        @DisplayName("returns 200 with page of categories")
        void returns200WithPageOfCategories() throws Exception {
            Page<CategoryDto> page = new PageImpl<>(Collections.singletonList(categoryDto), PageRequest.of(0, 10), 1);
            given(categoryService.getAllCategories(any(Pageable.class))).willReturn(page);

            mockMvc.perform(get("/api/categories"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Electronics"));
        }
    }

    @Nested
    @DisplayName("GET /api/categories/root")
    class GetRootCategories {
        @Test
        @DisplayName("returns 200 with page of root categories")
        void returns200WithPageOfRootCategories() throws Exception {
            Page<CategoryDto> page = new PageImpl<>(Collections.singletonList(categoryDto), PageRequest.of(0, 10), 1);
            given(categoryService.getRootCategories(any(Pageable.class))).willReturn(page);

            mockMvc.perform(get("/api/categories/root"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Electronics"));
        }
    }

    @Nested
    @DisplayName("GET /api/categories/{id}")
    class GetCategoryById {
        @Test
        @DisplayName("returns 200 with category")
        void returns200WithCategory() throws Exception {
            given(categoryService.getCategoryById(categoryId)).willReturn(categoryDto);

            mockMvc.perform(get("/api/categories/{id}", categoryId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Electronics"));
        }
    }

    @Nested
    @DisplayName("POST /api/categories")
    class CreateCategory {
        @Test
        @DisplayName("returns 201 with created category")
        void returns201WithCreatedCategory() throws Exception {
            given(categoryService.createCategory(any(CategoryCreateDto.class))).willReturn(categoryDto);

            mockMvc.perform(post("/api/categories")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(categoryCreateDto)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.name").value("Electronics"));
        }
    }

    @Nested
    @DisplayName("POST /api/categories/{id}/image")
    class UploadCategoryImage {
        @Test
        @DisplayName("returns 200 with updated category")
        void returns200WithUpdatedCategory() throws Exception {
            MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "content".getBytes());

            given(categoryService.getCategoryById(categoryId)).willReturn(categoryDto);
            willDoNothing().given(s3Service).deleteFile(any());
            given(s3Service.uploadFile(any(), eq("categories"))).willReturn("new-url");

            CategoryDto updatedDto = new CategoryDto(categoryId, "Electronics", "new-url", "electronics", "electronics", "desc", null, null, 10);
            given(categoryService.updateCategory(eq(categoryId), any(CategoryDto.class))).willReturn(updatedDto);

            mockMvc.perform(multipart("/api/categories/{id}/image", categoryId)
                            .file(file))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.imageUrl").value("new-url"));
        }
    }

    @Nested
    @DisplayName("DELETE /api/categories/{id}")
    class DeleteCategory {
        @Test
        @DisplayName("returns 204 no content")
        void returns204NoContent() throws Exception {
            given(categoryService.getCategoryById(categoryId)).willReturn(categoryDto);
            willDoNothing().given(s3Service).deleteFile(any());
            willDoNothing().given(categoryService).deleteCategory(categoryId);

            mockMvc.perform(delete("/api/categories/{id}", categoryId))
                    .andExpect(status().isNoContent());

            verify(categoryService).deleteCategory(categoryId);
        }
    }
}
