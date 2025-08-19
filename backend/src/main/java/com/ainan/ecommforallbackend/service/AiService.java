package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.*;
import com.ainan.ecommforallbackend.util.PromptTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiService {

    private final ChatClient chatClient;
    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;

    public ProductDescriptionResponseDto generateProductDescription(
            ProductDescriptionRequestDto request, UUID productId) {
        try {
            log.info("Processing AI description request for product: {}",
                    productId != null ? "ID " + productId : request.getProductName());

            // Enhance request with product details if productId is provided
            ProductDescriptionRequestDto finalRequest = request;
            if (productId != null) {
                finalRequest = enhanceRequestWithProductDetails(request, productId);
                log.info("Enhanced request with details from product ID: {}", productId);
            }

            // Apply default values
            finalRequest = applyDefaults(finalRequest);

            // Generate description using AI
            String generatedDescription = generateWithAI(finalRequest);
            log.info("AI Response received: '{}'", generatedDescription);
            generatedDescription = postProcessDescription(generatedDescription, finalRequest);

            log.info("Successfully generated description for product: {}", finalRequest.getProductName());
            return ProductDescriptionResponseDto.success(
                    generatedDescription,
                    finalRequest.getExistingDescription(),
                    finalRequest.getTone());

        } catch (Exception e) {
            log.error("Error generating product description: {}", e.getMessage(), e);
            return ProductDescriptionResponseDto.error("Failed to generate product description: " + e.getMessage());
        }
    }

    private ProductDescriptionRequestDto applyDefaults(ProductDescriptionRequestDto request) {
        if (request.getTone() == null) {
            request.setTone("professional");
        }
        if (request.getMaxLength() == null) {
            request.setMaxLength(150);
        }
        return request;
    }

    private ProductDescriptionRequestDto enhanceRequestWithProductDetails(
            ProductDescriptionRequestDto request, UUID productId) {
        try {
            ProductDto product = productService.getProductById(productId, List.of("variants"));
            return mergeRequestWithProductData(request, product);
        } catch (Exception e) {
            log.warn("Could not enhance request with product details for ID {}: {}", productId, e.getMessage());
            return request;
        }
    }

    private ProductDescriptionRequestDto mergeRequestWithProductData(
            ProductDescriptionRequestDto request, ProductDto product) {

        ProductDescriptionRequestDto enhanced = new ProductDescriptionRequestDto();

        // User inputs take precedence
        enhanced.setProductName(request.getProductName() != null ? request.getProductName() : product.getName());
        enhanced.setExistingDescription(request.getExistingDescription() != null ? request.getExistingDescription() : product.getDescription());
        enhanced.setTone(request.getTone());
        enhanced.setMaxLength(request.getMaxLength());
        enhanced.setAttributes(request.getAttributes());
        enhanced.setTargetAudience(request.getTargetAudience());

        // Enhance with product details if not provided in request
        enhanced.setBrand(request.getBrand() != null ? request.getBrand() : fetchBrandName(product.getBrandId()));
        enhanced.setCategory(request.getCategory() != null ? request.getCategory() : fetchCategoryName(product.getCategoryId()));

        // Handle variants
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            enhanced.setHasVariants(true);
            enhanced.setVariants(request.getVariants() != null ? request.getVariants() : product.getVariants());
        } else {
            enhanced.setHasVariants(request.getHasVariants());
            enhanced.setVariants(request.getVariants());
        }

        return enhanced;
    }

    private String fetchBrandName(UUID brandId) {
        if (brandId == null) return null;
        try {
            BrandDto brand = brandService.getBrandById(brandId);
            return brand != null ? brand.getName() : null;
        } catch (Exception e) {
            log.warn("Could not fetch brand {}: {}", brandId, e.getMessage());
            return null;
        }
    }

    private String fetchCategoryName(UUID categoryId) {
        if (categoryId == null) return null;
        try {
            CategoryDto category = categoryService.getCategoryById(categoryId);
            return category != null ? category.getName() : null;
        } catch (Exception e) {
            log.warn("Could not fetch category {}: {}", categoryId, e.getMessage());
            return null;
        }
    }

    private String generateWithAI(ProductDescriptionRequestDto request) {
        String promptTemplate = PromptTemplates.PRODUCT_DESCRIPTION;

        Map<String, Object> promptVariables = buildPromptVariables(request);

        try {
            String aiResponse = chatClient.prompt()
                    .system("You are an expert e-commerce copywriter specializing in creating compelling product descriptions that drive conversions.")
                    .user(userSpec -> userSpec.text(promptTemplate).params(promptVariables))
                    .call()
                    .content();

            log.info("AI Response length: {}", aiResponse != null ? aiResponse.length() : "null");

            return aiResponse;
        } catch (Exception e) {
            log.error("Error calling ChatClient: {}", e.getMessage(), e);
            throw e;
        }

    }

    private String postProcessDescription(String description, ProductDescriptionRequestDto request) {
        description = description.trim();
        if (request.getMaxLength() != null) {
            String[] words = description.split("\\s+");
            if (words.length > request.getMaxLength()) {
                description = truncateToWordLimit(description, request.getMaxLength());
            }
        }

        log.info("Post-processed description: '{}'", description);
        return description;
    }

    private String truncateToWordLimit(String text, int maxWords) {
        String[] words = text.split("\\s+");
        if (words.length <= maxWords) {
            return text;
        }

        StringBuilder truncated = new StringBuilder();
        for (int i = 0; i < maxWords; i++) {
            truncated.append(words[i]).append(" ");
        }

        return truncated.toString().trim();
    }

    private Map<String, Object> buildPromptVariables(ProductDescriptionRequestDto request) {
        String existingDescription = "";
        if (request.getExistingDescription() != null && !request.getExistingDescription().trim().isEmpty()) {
            existingDescription = "Existing Description (improve this): " + request.getExistingDescription();
        }

        String variantInfo = "";
        if (request.getHasVariants() != null && request.getHasVariants() &&
                request.getVariants() != null && !request.getVariants().isEmpty()) {
            variantInfo = buildVariantInfo(request);
        }

        return Map.of(
                "productName", request.getProductName(),
                "category", request.getCategory() != null ? request.getCategory() : "",
                "brand", request.getBrand() != null ? request.getBrand() : "",
                "targetAudience", request.getTargetAudience() != null ? request.getTargetAudience() : "",
                "tone", request.getTone(),
                "maxLength", request.getMaxLength(),
                "existingDescription", existingDescription,
                "variantInfo", variantInfo
        );
    }

    private String buildVariantInfo(ProductDescriptionRequestDto request) {
        StringBuilder variantBuilder = new StringBuilder();
        variantBuilder.append("Product Variants:\n");

        for (int i = 0; i < request.getVariants().size(); i++) {
            ProductVariantDto variant = request.getVariants().get(i);
            variantBuilder.append("Variant ").append(i + 1).append(":\n");

            if (variant.getAttributeValues() != null && !variant.getAttributeValues().isEmpty()) {
                variantBuilder.append("  Attributes: ");
                variant.getAttributeValues()
                        .forEach((key, value) -> variantBuilder.append(key).append(": ").append(value).append(", "));
                if (variantBuilder.length() > 2) {
                    variantBuilder.setLength(variantBuilder.length() - 2);
                }
                variantBuilder.append("\n");
            }

            if (variant.getPrice() != null) {
                variantBuilder.append("  Price: $").append(variant.getPrice()).append("\n");
            }

            variantBuilder.append("  Stock: ").append(variant.getStock()).append(" units\n\n");
        }

        variantBuilder.append("Note: This product comes in multiple variants. ");
        variantBuilder.append("Mention the available options without being too specific about pricing.");

        return variantBuilder.toString();
    }

    public boolean isServiceHealthy() {
        try {
            // Simple test to check if AI service is responsive
            chatClient.prompt()
                    .user("Test")
                    .call()
                    .content();
            return true;
        } catch (Exception e) {
            log.error("AI service health check failed: {}", e.getMessage());
            return false;
        }
    }
}