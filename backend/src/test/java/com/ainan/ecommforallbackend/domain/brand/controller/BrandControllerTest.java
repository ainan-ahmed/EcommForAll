package com.ainan.ecommforallbackend.domain.brand.controller;

import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.service.BrandService;
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

import java.time.LocalDateTime;
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
@DisplayName("BrandController Unit Tests")
class BrandControllerTest {

    @Mock
    private BrandService brandService;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private BrandController brandController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private BrandDto brandDto;
    private BrandCreateDto brandCreateDto;
    private UUID brandId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(brandController)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        brandId = UUID.randomUUID();
        brandDto = new BrandDto(
                brandId,
                "Test Brand",
                "Description",
                "http://example.com/img.jpg",
                "http://example.com",
                true,
                LocalDateTime.now(),
                LocalDateTime.now(),
                5
        );

        brandCreateDto = new BrandCreateDto("Test Brand", "Description", "http://example.com/img.jpg", "http://example.com");
    }

    @Nested
    @DisplayName("GET /api/brands")
    class GetAllBrands {
        @Test
        @DisplayName("returns 200 with page of brands")
        void returns200WithPageOfBrands() throws Exception {
            // Use concrete PageRequest to avoid UnsupportedOperationException during serialization of Pageable.unpaged()
            Page<BrandDto> page = new PageImpl<>(Collections.singletonList(brandDto), PageRequest.of(0, 10), 1);
            given(brandService.getAllBrands(any(Pageable.class))).willReturn(page);

            mockMvc.perform(get("/api/brands"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Test Brand"));
        }
    }

    @Nested
    @DisplayName("GET /api/brands/{id}")
    class GetBrandById {
        @Test
        @DisplayName("returns 200 with brand")
        void returns200WithBrand() throws Exception {
            given(brandService.getBrandById(brandId)).willReturn(brandDto);

            mockMvc.perform(get("/api/brands/{id}", brandId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Test Brand"));
        }
    }

    @Nested
    @DisplayName("POST /api/brands")
    class CreateBrand {
        @Test
        @DisplayName("returns 201 with created brand")
        void returns201WithCreatedBrand() throws Exception {
            given(brandService.createBrand(any(BrandCreateDto.class))).willReturn(brandDto);

            mockMvc.perform(post("/api/brands")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(brandCreateDto)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.name").value("Test Brand"));
        }
    }

    @Nested
    @DisplayName("POST /api/brands/{id}/image")
    class UploadBrandImage {
        @Test
        @DisplayName("returns 200 with updated brand")
        void returns200WithUpdatedBrand() throws Exception {
            MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "content".getBytes());
            
            given(brandService.getBrandById(brandId)).willReturn(brandDto);
            // brandDto has an image URL, so deleteFile should be called
            willDoNothing().given(s3Service).deleteFile(any());
            given(s3Service.uploadFile(any(), eq("brands"))).willReturn("new-url");
            
            BrandDto updatedBrand = new BrandDto(brandId, "Test Brand", "Desc", "new-url", "web", true, null, null, 5);
            given(brandService.updateBrand(eq(brandId), any(BrandDto.class))).willReturn(updatedBrand);

            mockMvc.perform(multipart("/api/brands/{id}/image", brandId)
                            .file(file))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.imageUrl").value("new-url"));
        }
    }

    @Nested
    @DisplayName("DELETE /api/brands/{id}")
    class DeleteBrand {
        @Test
        @DisplayName("returns 204 no content")
        void returns204NoContent() throws Exception {
            given(brandService.getBrandById(brandId)).willReturn(brandDto);
            willDoNothing().given(s3Service).deleteFile(any());
            willDoNothing().given(brandService).deleteBrand(brandId);

            mockMvc.perform(delete("/api/brands/{id}", brandId))
                    .andExpect(status().isNoContent());

            verify(brandService).deleteBrand(brandId);
        }
    }
}
