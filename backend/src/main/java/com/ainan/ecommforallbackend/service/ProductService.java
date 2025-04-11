package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.dto.ProductDto;
import com.ainan.ecommforallbackend.dto.ProductFilterDto;
import com.ainan.ecommforallbackend.entity.Product;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    Page<ProductDto> getAllProducts(Pageable pageable);

    Page<ProductDto> getFilteredProducts(ProductFilterDto filter, Pageable pageable);

    ProductDto getProductById(UUID id, List<String> includes);
    ProductDto createProduct(ProductCreateDto productCreateDto);
    ProductDto updateProduct( UUID id, ProductDto productDto);
    void deleteProduct(UUID id);
    Page<ProductDto> getProductsByCategoryId(UUID categoryId, Pageable pageable);
    Page<ProductDto> getProductsByBrandId(UUID brandId, Pageable pageable);
    Page<ProductDto> getProductsBySellerId(UUID sellerId, Pageable pageable);
    Page<ProductDto> getActiveProducts(Pageable pageable);
    Page<ProductDto> getFeaturedProducts(Pageable pageable);
}
