package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.dto.ProductImageDto;
import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.entity.ProductImage;
import com.ainan.ecommforallbackend.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.mapper.ProductImageMapper;
import com.ainan.ecommforallbackend.repository.ProductImageRepository;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Data
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ProductImageMapper productImageMapper;

    @Override
    public Page<ProductImageDto> getImagesByProductId(UUID productId, Pageable pageable) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Page<ProductImage> productImages = productImageRepository.findByProductId(product.getId(), pageable);
        return productImages.map(productImageMapper::productImageToProductImageDto);
    }

    @Override
    public ProductImageDto getImageById(UUID id) {
        return productImageMapper.productImageToProductImageDto(productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id)));
    }

    @Override
    public ProductImageDto createImage(ProductImageCreateDto productImageCreateDto) {
        Product product = productRepository.findById(productImageCreateDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productImageCreateDto.getProductId()));
        ProductImage productImage = productImageMapper.productImageCreateDtoToProductImage(productImageCreateDto);
        productImage.setProduct(product);
        ProductImage savedProductImage = productImageRepository.save(productImage);
        return productImageMapper.productImageToProductImageDto(savedProductImage);
    }

    @Override
    public ProductImageDto updateImage(UUID id, ProductImageDto imageDto) {
        Product product = productRepository.findById(imageDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + imageDto.getProductId()));
        ProductImage productImage = productImageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        productImage.setProduct(product);
        ProductImage updatedProductImage = productImageRepository.save(productImage);
        return productImageMapper.productImageToProductImageDto(updatedProductImage);
    }

    @Override
    public void deleteImage(UUID id) {
        ProductImage productImage = productImageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        productImageRepository.delete(productImage);
    }
}
