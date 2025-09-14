package com.ainan.ecommforallbackend.domain.product.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.order.dto.ImageSortOrderDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.entity.ProductImage;
import com.ainan.ecommforallbackend.domain.product.mapper.ProductImageMapper;
import com.ainan.ecommforallbackend.domain.product.repository.ProductImageRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Data
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ProductImageMapper productImageMapper;
    private final S3Service s3Service;

    @Override
    public Page<ProductImageDto> getImagesByProductId(UUID productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Page<ProductImage> productImages = productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId(), pageable);
        return productImages.map(image -> convertToPresignedUrl(productImageMapper.productImageToProductImageDto(image)));
    }

    @Override
    public ProductImageDto getImageById(UUID id) {
        ProductImage image = productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        return convertToPresignedUrl(productImageMapper.productImageToProductImageDto(image));
    }

    @Override
    public ProductImageDto createImage(ProductImageCreateDto productImageCreateDto) {
        Product product = productRepository.findById(productImageCreateDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productImageCreateDto.getProductId()));
        ProductImage productImage = productImageMapper.productImageCreateDtoToProductImage(productImageCreateDto);
        productImage.setProduct(product);
        ProductImage savedProductImage = productImageRepository.save(productImage);
        return convertToPresignedUrl(productImageMapper.productImageToProductImageDto(savedProductImage));
    }

    @Override
    public ProductImageDto updateImage(UUID id, ProductImageDto imageDto) {
        Product product = productRepository.findById(imageDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + imageDto.getProductId()));
        ProductImage productImage = productImageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        productImage.setProduct(product);
        ProductImage updatedProductImage = productImageRepository.save(productImage);
        return convertToPresignedUrl(productImageMapper.productImageToProductImageDto(updatedProductImage));
    }
    @Override
    @Transactional
    public List<ProductImageDto> updateImagesOrder(UUID productId, List<ImageSortOrderDto> imageOrders) {
        // Verify the product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Verify all images belong to this product
        List<UUID> imageIds = imageOrders.stream()
                .map(ImageSortOrderDto::getId)
                .collect(Collectors.toList());
        List<ProductImage> images = productImageRepository.findAllById(imageIds);

        if (images.size() != imageIds.size()) {
            throw new ResourceNotFoundException("One or more images not found");
        }

        // Check all images belong to the product
        for (ProductImage image : images) {
            if (!image.getProduct().getId().equals(productId)) {
                throw new IllegalArgumentException("Image does not belong to the specified product");
            }
        }

        // Update sort orders
        for (ImageSortOrderDto orderDto : imageOrders) {
            ProductImage image = images.stream()
                    .filter(img -> img.getId().equals(orderDto.getId()))
                    .findFirst()
                    .orElseThrow();

            image.setSortOrder(orderDto.getSortOrder());
            productImageRepository.save(image);
        }

        // Return updated images
        Page<ProductImage> updatedImages = productImageRepository.findByProductIdOrderBySortOrderAsc(productId, Pageable.unpaged());
        return updatedImages.map(image ->
                        convertToPresignedUrl(productImageMapper.productImageToProductImageDto(image)))
                .getContent();
    }
    @Override
    public void deleteImage(UUID id) {
        ProductImage productImage = productImageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        productImageRepository.delete(productImage);
    }
    public ProductImageDto convertToPresignedUrl(ProductImageDto imageDto) {
        if (imageDto != null && imageDto.getImageUrl() != null) {
            // Extract key from URL
            String imageUrl = imageDto.getImageUrl();
            URI uri = URI.create(imageUrl);
            String key = uri.getPath();
            if (key.startsWith("/")) {
                key = key.substring(1);
            }

            // Generate a pre-signed URL with 1-hour expiration
            String presignedUrl = s3Service.generatePresignedDownloadUrl(key, 60);
            imageDto.setImageUrl(presignedUrl);
        }
        System.out.println(imageDto);
        return imageDto;
    }
}
