package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ProductDescriptionRequestDto;
import com.ainan.ecommforallbackend.dto.ProductDescriptionResponseDto;
import com.ainan.ecommforallbackend.dto.SimilarProductsResponseDto;
import com.ainan.ecommforallbackend.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Service", description = "AI-powered product description generation")
public class AiController {

    private final AiService aiService;

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

        ProductDescriptionResponseDto response = aiService.generateProductDescription(request, productId);

        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Check AI service health", description = "Check if the AI service is operational")
    public ResponseEntity<String> healthCheck() {
        boolean isHealthy = aiService.isServiceHealthy();
        if (isHealthy) {
            return ResponseEntity.ok("AI Service is operational");
        } else {
            return ResponseEntity.status(503).body("AI Service is not operational");
        }
    }

    @GetMapping("/similar-products/{productId}")
    @Operation(
            summary = "Find similar products",
            description = """
                    Find products similar to the given product using AI embeddings and vector similarity search.
                    The endpoint uses product features like name, description, category, and price to find 
                    semantically similar products.
                    """
    )
    public ResponseEntity<SimilarProductsResponseDto> findSimilarProducts(
            @Parameter(description = "Product ID to find similar products for")
            @PathVariable UUID productId,
            @Parameter(description = "Number of similar products to return (default: 5, max: 20)")
            @RequestParam(defaultValue = "5") @Valid @Min(1) @Max(20) int limit) {

        SimilarProductsResponseDto response = aiService.findSimilarProducts(productId, limit);

        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

}