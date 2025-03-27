package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ProductImageDto;
import com.ainan.ecommforallbackend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;

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

//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ProductImageDto> uploadProductImage(
//            @PathVariable UUID productId,
//            @RequestParam("file") MultipartFile file,
//            @RequestParam(required = false, defaultValue = "false") Boolean isPrimary) {
//        return new ResponseEntity<>(productImageService.uploadImage(productId, file, isPrimary), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<ProductImageDto> updateProductImage(
//            @PathVariable UUID productId,
//            @PathVariable UUID id,
//            @RequestBody ProductImageDto productImageDto) {
//        return ResponseEntity.ok(productImageService.updateImage(id, productImageDto));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteProductImage(
//            @PathVariable UUID productId,
//            @PathVariable UUID id) {
//        productImageService.deleteImage(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @PutMapping("/{id}/set-primary")
//    public ResponseEntity<ProductImageDto> setPrimaryImage(
//            @PathVariable UUID productId,
//            @PathVariable UUID id) {
//        return ResponseEntity.ok(productImageService.setPrimaryImage(productId, id));
//    }
}