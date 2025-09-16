package com.ainan.ecommforallbackend.domain.product.controller;

import com.ainan.ecommforallbackend.domain.product.dto.VariantImageCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.VariantImageDto;
import com.ainan.ecommforallbackend.domain.product.service.S3Service;
import com.ainan.ecommforallbackend.domain.product.service.VariantImageService;

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
@RequestMapping("/api/products/{productId}/variants/{variantId}/images")
@RequiredArgsConstructor
public class VariantImageController {

    private final VariantImageService variantImageService;
    private final S3Service s3Service;

    @GetMapping
    public ResponseEntity<Page<VariantImageDto>> getAllVariantImages(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            Pageable pageable) {
        return ResponseEntity.ok(variantImageService.getImagesByVariantId(variantId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VariantImageDto> getVariantImage(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @PathVariable UUID id) {
        return ResponseEntity.ok(variantImageService.getImageById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VariantImageDto> createVariantImage(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", defaultValue = "0") int sortOrder) throws IOException {

        String fileName = s3Service.uploadFile(file);

        VariantImageCreateDto variantImageCreateDto = new VariantImageCreateDto();
        variantImageCreateDto.setVariantId(variantId);
        variantImageCreateDto.setImageUrl(fileName);
        variantImageCreateDto.setAltText(altText);
        variantImageCreateDto.setSortOrder(sortOrder);

        return new ResponseEntity<>(variantImageService.createImage(variantImageCreateDto), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VariantImageDto> updateVariantImage(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @PathVariable UUID id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder) throws IOException {

        VariantImageDto existingImage = variantImageService.getImageById(id);

        if (file != null && !file.isEmpty()) {
            s3Service.deleteFile(existingImage.getImageUrl());
            String newImageUrl = s3Service.uploadFile(file);
            existingImage.setImageUrl(newImageUrl);
        }
        if (altText != null) {
            existingImage.setAltText(altText);
        }
        if (sortOrder != null) {
            existingImage.setSortOrder(sortOrder);
        }

        return ResponseEntity.ok(variantImageService.updateImage(id, existingImage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariantImage(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @PathVariable UUID id) {

        VariantImageDto image = variantImageService.getImageById(id);
        variantImageService.deleteImage(id);
        if (image.getImageUrl() != null) {
            s3Service.deleteFile(image.getImageUrl());
        }
        return ResponseEntity.noContent().build();
    }
}