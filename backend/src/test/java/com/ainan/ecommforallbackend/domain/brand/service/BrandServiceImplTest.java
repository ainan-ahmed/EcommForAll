package com.ainan.ecommforallbackend.domain.brand.service;

import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.entity.Brand;
import com.ainan.ecommforallbackend.domain.brand.repository.BrandRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BrandServiceImpl Unit Tests")
class BrandServiceImplTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private BrandServiceImpl brandService;

    private Brand brand;
    private BrandDto brandDto;
    private BrandCreateDto brandCreateDto;
    private UUID brandId;

    @BeforeEach
    void setUp() {
        brandId = UUID.randomUUID();
        brand = new Brand();
        brand.setId(brandId);
        brand.setName("Test Brand");
        brand.setDescription("Test Description");
        brand.setImageUrl("http://example.com/image.jpg");
        brand.setWebsite("http://example.com");
        brand.setIsActive(true);
        brand.setCreatedAt(LocalDateTime.now());
        brand.setUpdatedAt(LocalDateTime.now());

        // Note: BrandDto has @AllArgsConstructor, order matters:
        // UUID id, String name, String description, String imageUrl, String website, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt, Integer productCount
        brandDto = new BrandDto(
                brandId,
                "Test Brand",
                "Test Description",
                "http://example.com/image.jpg",
                "http://example.com",
                true,
                LocalDateTime.now(),
                LocalDateTime.now(),
                0
        );

        brandCreateDto = new BrandCreateDto("Test Brand", "Test Description", "http://example.com/image.jpg", "http://example.com");
    }

    @Nested
    @DisplayName("getAllBrands()")
    class GetAllBrands {
        @Test
        @DisplayName("returns page of brand dtos")
        void returnsPageOfBrandDtos() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Brand> brandPage = new PageImpl<>(Collections.singletonList(brand));

            given(brandRepository.findAll(pageable)).willReturn(brandPage);
            given(productRepository.countByBrandId(brandId)).willReturn(5L);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            Page<BrandDto> result = brandService.getAllBrands(pageable);

            assertThat(result).isNotEmpty();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Test Brand");
            assertThat(result.getContent().get(0).getProductCount()).isEqualTo(5);
            assertThat(result.getContent().get(0).getImageUrl()).isEqualTo("presigned-url");
        }
    }

    @Nested
    @DisplayName("getBrandById()")
    class GetBrandById {
        @Test
        @DisplayName("returns brand dto when found")
        void returnsBrandDtoWhenFound() {
            given(brandRepository.findById(brandId)).willReturn(Optional.of(brand));
            given(productRepository.countByBrandId(brandId)).willReturn(10L);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            BrandDto result = brandService.getBrandById(brandId);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Test Brand");
            assertThat(result.getProductCount()).isEqualTo(10);
        }

        @Test
        @DisplayName("throws exception when not found")
        void throwsExceptionWhenNotFound() {
            given(brandRepository.findById(brandId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> brandService.getBrandById(brandId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Brand not found");
        }
    }

    @Nested
    @DisplayName("createBrand()")
    class CreateBrand {
        @Test
        @DisplayName("creates and returns brand dto")
        void createsAndReturnsBrandDto() {
            given(brandRepository.findByNameIgnoreCase(brandCreateDto.getName())).willReturn(Optional.empty());
            given(brandRepository.save(any(Brand.class))).willAnswer(invocation -> {
                Brand saved = invocation.getArgument(0);
                saved.setId(brandId);
                return saved;
            });
            // Mock s3Service for the DTO conversion that happens after save
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            BrandDto result = brandService.createBrand(brandCreateDto);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo(brandCreateDto.getName());
            verify(brandRepository).save(any(Brand.class));
        }

        @Test
        @DisplayName("throws exception when name exists")
        void throwsExceptionWhenNameExists() {
            given(brandRepository.findByNameIgnoreCase(brandCreateDto.getName())).willReturn(Optional.of(brand));

            assertThatThrownBy(() -> brandService.createBrand(brandCreateDto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Brand already exists");
            
            verify(brandRepository, never()).save(any(Brand.class));
        }
    }

    @Nested
    @DisplayName("updateBrand()")
    class UpdateBrand {
        @Test
        @DisplayName("updates and returns brand dto")
        void updatesAndReturnsBrandDto() {
            // Modify DTO for update
            BrandDto updateDto = new BrandDto(
                    brandId, "Updated Brand", "Desc", "img", "web", true, null, null, 0
            );

            given(brandRepository.findById(brandId)).willReturn(Optional.of(brand));
            // No name conflict
            given(brandRepository.findByNameIgnoreCase("Updated Brand")).willReturn(Optional.empty());
            given(brandRepository.save(any(Brand.class))).willReturn(brand);
            given(s3Service.generatePresignedDownloadUrl(anyString(), anyLong())).willReturn("presigned-url");

            BrandDto result = brandService.updateBrand(brandId, updateDto);

            assertThat(result.getName()).isEqualTo("Updated Brand");
            verify(brandRepository).save(brand);
        }
    }

    @Nested
    @DisplayName("deleteBrand()")
    class DeleteBrand {
        @Test
        @DisplayName("soft deletes brand")
        void softDeletesBrand() {
            given(brandRepository.findById(brandId)).willReturn(Optional.of(brand));
            given(brandRepository.save(brand)).willReturn(brand);

            brandService.deleteBrand(brandId);

            assertThat(brand.getIsActive()).isFalse();
            verify(brandRepository).save(brand);
        }
    }
}
