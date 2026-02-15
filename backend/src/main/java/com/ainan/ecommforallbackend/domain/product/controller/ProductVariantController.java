package com.ainan.ecommforallbackend.domain.product.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.domain.product.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/variants")
@RequiredArgsConstructor
@Tag(name = "Product Variants", description = "Manage product variants and option values")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @GetMapping
    @Operation(summary = "List variants", description = "Returns variants for a product.")
    public ResponseEntity<Page<ProductVariantDto>> getAllVariants(@PathVariable UUID productId, Pageable pageable) {
        return ResponseEntity.ok(productVariantService.getVariantsByProductId(productId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get variant", description = "Returns a product variant by ID.")
    public ResponseEntity<ProductVariantDto> getVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        return ResponseEntity.ok(productVariantService.getVariantById(id));
    }

    @PostMapping
    @Operation(summary = "Create variant", description = "Creates a variant for a product using attribute values.")
    public ResponseEntity<ProductVariantDto> createVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductVariantCreateDto variantCreateDto) {
        variantCreateDto.setAttributeValues(sanitizeAttributeMap(variantCreateDto.getAttributeValues()));
        variantCreateDto.setProductId(productId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productVariantService.createVariant(variantCreateDto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update variant", description = "Updates an existing variant's attributes.")
    public ResponseEntity<ProductVariantDto> updateVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @Valid @RequestBody ProductVariantDto variantDto) {

        variantDto.setAttributeValues(sanitizeAttributeMap(variantDto.getAttributeValues()));
        variantDto.setProductId(productId);
        return ResponseEntity.ok(productVariantService.updateVariant(id, variantDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete variant", description = "Deletes a product variant by ID.")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        productVariantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, String> sanitizeAttributeMap(Map<String, String> attributes) {
        if (attributes == null) {
            return new HashMap<>();
        }

        Map<String, String> sanitizedMap = new HashMap<>();
        attributes.forEach((k, v) ->
                sanitizedMap.put(k.trim().toLowerCase(), v != null ? v.trim() : ""));
        return sanitizedMap;
    }
}
