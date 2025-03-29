package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.dto.ProductImageDto;
import com.ainan.ecommforallbackend.service.ProductImageService;
import com.ainan.ecommforallbackend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;
    private final S3Service s3Service;

    @GetMapping
    public ResponseEntity<Page<ProductImageDto>> getAllProductImages(
            @PathVariable UUID productId,
            Pageable pageable) {
        return ResponseEntity.ok(productImageService.getImagesByProductId(productId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductImageDto> getProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        return ResponseEntity.ok(productImageService.getImageById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageDto> createProductImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", defaultValue = "0") int sortOrder) throws IOException {
        String fileName = s3Service.uploadFile(file);
        ProductImageCreateDto productImageCreateDto = new ProductImageCreateDto();
        productImageCreateDto.setProductId(productId);
        productImageCreateDto.setImageUrl(fileName);
        productImageCreateDto.setAltText(altText);
        productImageCreateDto.setSortOrder(sortOrder);
        return new ResponseEntity<>(productImageService.createImage(productImageCreateDto), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageDto> updateProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder) throws IOException {

        ProductImageDto existingImage = productImageService.getImageById(id);

        // Update file if provided
        if (file != null && !file.isEmpty()) {
            s3Service.deleteFile(existingImage.getImageUrl());
            String newImageUrl = s3Service.uploadFile(file);
            existingImage.setImageUrl(newImageUrl);
        }

        // Update metadata if provided
        if (altText != null) {
            existingImage.setAltText(altText);
        }

        if (sortOrder != null) {
            existingImage.setSortOrder(sortOrder);
        }

        return ResponseEntity.ok(productImageService.updateImage(id, existingImage));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        ProductImageDto image = productImageService.getImageById(id);
        productImageService.deleteImage(id);
        if(image.getImageUrl() != null) {
            s3Service.deleteFile(image.getImageUrl());
        }
        return ResponseEntity.noContent().build();
    }

}