package com.ainan.ecommforallbackend.domain.ai.agent;

import com.ainan.ecommforallbackend.core.util.PromptTemplates;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentRequest;
import com.ainan.ecommforallbackend.domain.ai.agent.base.BaseAgent;
import com.ainan.ecommforallbackend.domain.ai.dto.ProductDescriptionRequestDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.service.BrandService;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.service.CategoryService;
import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.domain.product.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Agent for generating or improving product descriptions.
 * Specializes in creating compelling e-commerce copy.
 */
@Slf4j
public class ProductDescriptionAgent extends BaseAgent {

    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private ProductDescriptionRequestDto requestDto;

    public ProductDescriptionAgent(
            ChatClient chatClient,
            ProductService productService,
            BrandService brandService,
            CategoryService categoryService) {
        super(chatClient);
        this.productService = productService;
        this.brandService = brandService;
        this.categoryService = categoryService;
    }

    @Override
    protected String getAgentName() {
        return "ProductDescriptionAgent";
    }

    @Override
    protected void validateRequest(AgentRequest request) {
        if (request.getInput() == null || request.getInput().isEmpty()) {
            throw new IllegalArgumentException("Request input cannot be empty");
        }

        Object requestObj = request.getInput().get("request");
        if (!(requestObj instanceof ProductDescriptionRequestDto)) {
            throw new IllegalArgumentException("Input must contain valid ProductDescriptionRequestDto");
        }

        ProductDescriptionRequestDto dto = (ProductDescriptionRequestDto) requestObj;
        if (dto.getProductName() == null || dto.getProductName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
    }

    @Override
    protected void setupAgent(AgentRequest request) {
        Object requestObj = request.getInput().get("request");
        this.requestDto = (ProductDescriptionRequestDto) requestObj;

        // Enhance with product details if productId is provided
        UUID productId = (UUID) request.getInputValue("productId");
        if (productId != null) {
            this.requestDto = enhanceRequestWithProductDetails(this.requestDto, productId);
            log.info("Enhanced request with product details for ID: {}", productId);
        }

        // Apply defaults
        applyDefaults();
    }

    @Override
    protected String buildSystemPrompt() {
        return "You are an expert e-commerce copywriter specializing in creating compelling product descriptions that drive conversions.";
    }

    @Override
    protected String buildUserPrompt(AgentRequest request) {
        String promptTemplate = PromptTemplates.PRODUCT_DESCRIPTION;
        // Map<String, Object> promptVariables = buildPromptVariables();

        // For simple template interpolation, we'll use the params in callAI
        return promptTemplate;
    }

    @Override
    protected String postProcessResponse(String aiResponse, AgentRequest request) {
        aiResponse = aiResponse.trim();

        if (requestDto.getMaxLength() != null) {
            String[] words = aiResponse.split("\\s+");
            if (words.length > requestDto.getMaxLength()) {
                aiResponse = truncateToWordLimit(aiResponse, requestDto.getMaxLength());
            }
        }

        log.info("Post-processed description: '{}'", aiResponse);
        return aiResponse;
    }

    @Override
    protected String callAI(String systemPrompt, String userPrompt, Map<String, Object> params) {
        Map<String, Object> promptVariables = buildPromptVariables();

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userSpec -> userSpec.text(userPrompt).params(promptVariables))
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error calling ChatClient: {}", e.getMessage(), e);
            throw new RuntimeException("AI call failed: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> buildPromptVariables() {
        String existingDescription = "";
        if (requestDto.getExistingDescription() != null && !requestDto.getExistingDescription().trim().isEmpty()) {
            existingDescription = "Existing Description (improve this): " + requestDto.getExistingDescription();
        }

        String variantInfo = "";
        if (requestDto.getHasVariants() != null && requestDto.getHasVariants() &&
                requestDto.getVariants() != null && !requestDto.getVariants().isEmpty()) {
            variantInfo = buildVariantInfo();
        }

        return Map.of(
                "productName", requestDto.getProductName(),
                "category", requestDto.getCategory() != null ? requestDto.getCategory() : "",
                "brand", requestDto.getBrand() != null ? requestDto.getBrand() : "",
                "targetAudience", requestDto.getTargetAudience() != null ? requestDto.getTargetAudience() : "",
                "tone", requestDto.getTone() != null ? requestDto.getTone() : "professional",
                "maxLength", requestDto.getMaxLength() != null ? requestDto.getMaxLength() : 150,
                "existingDescription", existingDescription,
                "variantInfo", variantInfo,
                "prompt", requestDto.getPrompt() != null ? requestDto.getPrompt() : "None");
    }

    private String buildVariantInfo() {
        StringBuilder variantBuilder = new StringBuilder();
        variantBuilder.append("Product Variants:\n");

        for (int i = 0; i < requestDto.getVariants().size(); i++) {
            ProductVariantDto variant = requestDto.getVariants().get(i);
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
        enhanced.setExistingDescription(
                request.getExistingDescription() != null ? request.getExistingDescription() : product.getDescription());
        enhanced.setTone(request.getTone());
        enhanced.setMaxLength(request.getMaxLength());
        enhanced.setAttributes(request.getAttributes());
        enhanced.setTargetAudience(request.getTargetAudience());

        // Enhance with product details if not provided in request
        enhanced.setBrand(request.getBrand() != null ? request.getBrand() : fetchBrandName(product.getBrandId()));
        enhanced.setCategory(
                request.getCategory() != null ? request.getCategory() : fetchCategoryName(product.getCategoryId()));

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
        if (brandId == null)
            return null;
        try {
            BrandDto brand = brandService.getBrandById(brandId);
            return brand != null ? brand.getName() : null;
        } catch (Exception e) {
            log.warn("Could not fetch brand {}: {}", brandId, e.getMessage());
            return null;
        }
    }

    private String fetchCategoryName(UUID categoryId) {
        if (categoryId == null)
            return null;
        try {
            CategoryDto category = categoryService.getCategoryById(categoryId);
            return category != null ? category.getName() : null;
        } catch (Exception e) {
            log.warn("Could not fetch category {}: {}", categoryId, e.getMessage());
            return null;
        }
    }

    private void applyDefaults() {
        if (requestDto.getTone() == null) {
            requestDto.setTone("professional");
        }
        if (requestDto.getMaxLength() == null) {
            requestDto.setMaxLength(150);
        }
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
}
