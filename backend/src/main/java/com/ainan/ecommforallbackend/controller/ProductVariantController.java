package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.service.ProductVariantService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @GetMapping
    public ResponseEntity<Page<ProductVariantDto>> getAllVariants(@PathVariable UUID productId, Pageable pageable) {
        return ResponseEntity.ok(productVariantService.getVariantsByProductId(productId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantDto> getVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        return ResponseEntity.ok(productVariantService.getVariantById(id));
    }

    @PostMapping
    public ResponseEntity<ProductVariantDto> createVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductVariantCreateDto variantCreateDto) {
        variantCreateDto.setAttributeValues(sanitizeAttributeMap(variantCreateDto.getAttributeValues()));
        variantCreateDto.setProductId(productId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productVariantService.createVariant(variantCreateDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariantDto> updateVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @Valid @RequestBody ProductVariantDto variantDto) {
        variantDto.setAttributeValues(sanitizeAttributeMap(variantDto.getAttributeValues()));
        variantDto.setProductId(productId);
        return ResponseEntity.ok(productVariantService.updateVariant(id,variantDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        productVariantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }
    private Map<String, String> sanitizeAttributeMap(Map<java.lang.String, java.lang.String> attributes) {
        if (attributes == null) {
            return new HashMap<>();
        }

        Map<java.lang.String, java.lang.String> sanitizedMap = new HashMap<>();
        attributes.forEach((k, v) ->
                sanitizedMap.put(k.trim().toLowerCase(), v != null ? v.trim() : ""));
        return sanitizedMap;
    }
}