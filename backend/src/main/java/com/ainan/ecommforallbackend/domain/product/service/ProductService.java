package com.ainan.ecommforallbackend.domain.product.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ainan.ecommforallbackend.domain.product.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductFilterDto;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    Page<ProductDto> getAllProducts(Pageable pageable);

    Page<ProductDto> getFilteredProducts(ProductFilterDto filter, Pageable pageable);

    ProductDto getProductById(UUID id, List<String> includes);

    ProductDto createProduct(ProductCreateDto productCreateDto);

    ProductDto updateProduct(UUID id, ProductDto productDto);

    void deleteProduct(UUID id);

    Page<ProductDto> getProductsByCategoryId(UUID categoryId, Pageable pageable);

    Page<ProductDto> getProductsByBrandId(UUID brandId, Pageable pageable);

    Page<ProductDto> getProductsBySellerId(UUID sellerId, Pageable pageable);

    Page<ProductDto> getActiveProducts(Pageable pageable);

    Page<ProductDto> getFeaturedProducts(Pageable pageable);

    // New methods for stock management
    boolean isProductInStock(UUID productId, Integer requiredQuantity);

    void reduceProductStock(UUID productId, UUID variantId, Integer quantity);
}
