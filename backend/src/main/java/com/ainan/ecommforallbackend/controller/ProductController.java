package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.dto.ProductDto;
import com.ainan.ecommforallbackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }
    // GET /api/products/550e8400-e29b-41d4-a716-446655440000?include=images,variants,variantImages
    // GET /api/products/550e8400-e29b-41d4-a716-446655440000?include=images
    // GET /api/products/550e8400-e29b-41d4-a716-446655440000?include=variants etc.
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id, @RequestParam(required = false) List<String> includes) {
        return ResponseEntity.ok(productService.getProductById(id, includes));
    }
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductCreateDto productCreateDto) {
        return new ResponseEntity<>(productService.createProduct(productCreateDto), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable UUID id, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto>> getProductsByCategory(@PathVariable UUID categoryId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId, pageable));
    }
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<Page<ProductDto>> getProductsByBrand(@PathVariable UUID brandId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByBrandId(brandId, pageable));
    }
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<ProductDto>> getProductsBySeller(@PathVariable UUID sellerId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsBySellerId(sellerId, pageable));
    }
    @GetMapping("/active")
    public ResponseEntity<Page<ProductDto>> getActiveProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getActiveProducts(pageable));
    }
    @GetMapping("/featured")
    public ResponseEntity<Page<ProductDto>> getFeaturedProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }



}
