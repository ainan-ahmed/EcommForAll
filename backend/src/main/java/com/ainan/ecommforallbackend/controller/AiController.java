package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.*;
import com.ainan.ecommforallbackend.service.AiService;
import com.ainan.ecommforallbackend.service.BrandService;
import com.ainan.ecommforallbackend.service.CategoryService;
import com.ainan.ecommforallbackend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Service", description = "AI-powered product description generation")
public class AiController {

    private final AiService aiService;
    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;

    @PostMapping("/generate-description")
    @Operation(
            summary = "Generate or improve product description",
            description = """
                    Generate a compelling product description using AI. This endpoint handles multiple scenarios:
                    
                    1. **Generate new description**: Provide product details without existingDescription
                    2. **Generate for existing product**: Provide productId to auto-populate product details
                    3. **Improve existing description**: Include existingDescription field to improve it
                    
                    The endpoint will automatically detect the scenario based on the provided fields.
                    """
    )
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ProductDescriptionResponseDto> generateProductDescription(
            @Valid @RequestBody ProductDescriptionRequestDto request,
            @Parameter(description = "Optional: Product ID to auto-populate product details")
            @RequestParam(required = false) UUID productId) {

        log.info("Received AI description request for product: {}",
                productId != null ? "ID " + productId : request.getProductName());

        try {
            ProductDescriptionRequestDto finalRequest = request;

            // If productId is provided, enhance the request with product details
            if (productId != null) {
                finalRequest = enhanceRequestWithProductDetails(request, productId);
                log.info("Enhanced request with details from product ID: {}", productId);
            }

            // Set default values if not provided
            if (finalRequest.getTone() == null) {
                finalRequest.setTone("professional");
            }
            if (finalRequest.getMaxLength() == null) {
                finalRequest.setMaxLength(150);
            }

            ProductDescriptionResponseDto response = aiService.generateProductDescription(finalRequest);

            if (response.getSuccess()) {
                log.info("Successfully generated description for product: {}", finalRequest.getProductName());
                return ResponseEntity.ok(response);
            } else {
                log.warn("Failed to generate description: {}", response.getErrorMessage());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error processing description request: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ProductDescriptionResponseDto.error("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Check AI service health", description = "Check if the AI service is operational")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AI Service is operational");
    }

    /**
     * Helper method to enhance request with product details when productId is provided
     */
    private ProductDescriptionRequestDto enhanceRequestWithProductDetails(
            ProductDescriptionRequestDto request, UUID productId) {

        try {
            ProductDto product = productService.getProductById(productId, List.of("variants"));

            // Create a new request object to avoid modifying the original
            ProductDescriptionRequestDto enhancedRequest = new ProductDescriptionRequestDto();

            // Copy existing request fields (user inputs take precedence)
            enhancedRequest.setProductName(
                    request.getProductName() != null ? request.getProductName() : product.getName());
            enhancedRequest.setExistingDescription(
                    request.getExistingDescription() != null ? request.getExistingDescription() : product.getDescription());
            enhancedRequest.setTone(request.getTone());
            enhancedRequest.setMaxLength(request.getMaxLength());
            enhancedRequest.setAttributes(request.getAttributes());
            enhancedRequest.setTargetAudience(request.getTargetAudience());

            // Enhance with product details if not provided in request
            if (request.getBrand() == null && product.getBrandId() != null) {
                try {
                    BrandDto brand = brandService.getBrandById(product.getBrandId());
                    enhancedRequest.setBrand(brand != null ? brand.getName() : null);
                } catch (Exception e) {
                    log.warn("Could not fetch brand for product {}: {}", productId, e.getMessage());
                }
            } else {
                enhancedRequest.setBrand(request.getBrand());
            }

            if (request.getCategory() == null && product.getCategoryId() != null) {
                try {
                    CategoryDto category = categoryService.getCategoryById(product.getCategoryId());
                    enhancedRequest.setCategory(category != null ? category.getName() : null);
                } catch (Exception e) {
                    log.warn("Could not fetch category for product {}: {}", productId, e.getMessage());
                }
            } else {
                enhancedRequest.setCategory(request.getCategory());
            }

            // Handle variants - merge request variants with product variants
            if (product.getVariants() != null && !product.getVariants().isEmpty()) {
                enhancedRequest.setHasVariants(true);
                enhancedRequest.setVariants(
                        request.getVariants() != null ? request.getVariants() : product.getVariants());
            } else {
                enhancedRequest.setHasVariants(request.getHasVariants());
                enhancedRequest.setVariants(request.getVariants());
            }

            return enhancedRequest;

        } catch (Exception e) {
            log.warn("Could not enhance request with product details for ID {}: {}", productId, e.getMessage());
            // Return original request if product details cannot be fetched
            return request;
        }
    }
}