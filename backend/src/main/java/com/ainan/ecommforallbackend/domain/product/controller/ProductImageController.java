package com.ainan.ecommforallbackend.domain.product.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.order.dto.ImageSortOrderDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.service.ProductImageService;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity<?> createProductImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", defaultValue = "0") int sortOrder) throws IOException {
        try {
            String fileName = s3Service.uploadFile(file);
            ProductImageCreateDto productImageCreateDto = new ProductImageCreateDto();
            productImageCreateDto.setProductId(productId);
            productImageCreateDto.setImageUrl(fileName);
            productImageCreateDto.setAltText(altText);
            productImageCreateDto.setSortOrder(sortOrder);
            return new ResponseEntity<>(productImageService.createImage(productImageCreateDto), HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "File upload failed",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "S3 upload failed",
                            "message", e.getMessage()
                    ));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder) throws IOException {

        try {
            ProductImageDto existingImage = productImageService.getImageById(id);

            // Update the file if provided
            if (file != null && !file.isEmpty()) {
                try {
                    s3Service.deleteFile(existingImage.getImageUrl());
                } catch (Exception e) {
                    System.err.println("Failed to delete old image: " + e.getMessage());
                }

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
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "File upload failed",
                            "message", e.getMessage()
                    ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Resource not found",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "S3 operation failed",
                            "message", e.getMessage()
                    ));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        try {
            ProductImageDto image = productImageService.getImageById(id);
            productImageService.deleteImage(id);
            if(image.getImageUrl() != null) {
                s3Service.deleteFile(image.getImageUrl());
            }
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Resource not found",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to delete image",
                            "message", e.getMessage()
                    ));
        }
    }
    @PutMapping("/reorder")
    public ResponseEntity<List<ProductImageDto>> reorderProductImages(
            @PathVariable UUID productId,
            @RequestBody List<ImageSortOrderDto> imageOrders) {
        return ResponseEntity.ok(productImageService.updateImagesOrder(productId, imageOrders));
    }


}