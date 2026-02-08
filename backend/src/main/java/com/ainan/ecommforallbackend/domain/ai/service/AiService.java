package com.ainan.ecommforallbackend.domain.ai.service;

import com.ainan.ecommforallbackend.core.util.PromptTemplates;
import com.ainan.ecommforallbackend.domain.ai.agent.AgentFactory;
import com.ainan.ecommforallbackend.domain.ai.agent.ProductDescriptionAgent;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentRequest;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentResponse;
import com.ainan.ecommforallbackend.domain.ai.dto.ProductDescriptionRequestDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ProductDescriptionResponseDto;
import com.ainan.ecommforallbackend.domain.ai.dto.SimilarProductsResponseDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.service.BrandService;
import com.ainan.ecommforallbackend.domain.category.dto.CategoryDto;
import com.ainan.ecommforallbackend.domain.category.service.CategoryService;
import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.domain.product.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.aspectj.weaver.loadtime.Agent;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
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
    private final VectorStore vectorStore;
    private final AgentFactory agentFactory;

    public ProductDescriptionResponseDto generateProductDescription(
            ProductDescriptionRequestDto request, UUID productId) {
        try {
            log.info("Processing AI description request for product: {}",
                    productId != null ? "ID " + productId : request.getProductName());
            ProductDescriptionAgent productDescriptionAgent = agentFactory.createProductDescriptionAgent();
            AgentRequest agentRequest = AgentRequest.builder()
                    .requestId(UUID.randomUUID())
                    .requestType("ProductDescription")
                    .input(Map.of(
                            "request", request,
                            "productId", productId))
                    .build();
            AgentResponse agentResponse = productDescriptionAgent.execute(agentRequest);
            // Enhance request with product details if productId is provided
            log.info("Successfully generated description for product: {}", request.getProductName());
            return ProductDescriptionResponseDto.success(
                    agentResponse.getContent(),
                    request.getExistingDescription(),
                    request.getTone());

        } catch (Exception e) {
            log.error("Error generating product description: {}", e.getMessage(), e);
            return ProductDescriptionResponseDto.error("Failed to generate product description: " + e.getMessage());
        }
    }

    public SimilarProductsResponseDto findSimilarProducts(UUID productId, int limit) {
        try {
            log.info("Finding similar products for productId: {}", productId);

            // Get the source product
            ProductDto sourceProduct = productService.getProductById(productId, null);
            if (sourceProduct == null) {
                throw new RuntimeException("Product not found with id: " + productId);
            }

            // Create query text from source product for similarity search
            String queryText = createProductTextForSimilarity(sourceProduct);
            log.debug("Query text for similarity search: {}", queryText);
            
            // Use VectorStore's built-in similarity search
            List<Document> similarDocuments = vectorStore.similaritySearch(queryText);

            // Convert documents to ProductDto
            List<ProductDto> similarProducts = convertDocumentsToProductDtos(similarDocuments, productId, limit);

            return SimilarProductsResponseDto.builder()
                    .success(true)
                    .message("Similar products found successfully")
                    .sourceProductId(productId)
                    .sourceProductName(sourceProduct.getName())
                    .similarProducts(similarProducts)
                    .totalFound(similarProducts.size())
                    .build();

        } catch (Exception e) {
            log.error("Error finding similar products for productId: {}", productId, e);
            return SimilarProductsResponseDto.builder()
                    .success(false)
                    .message("Failed to find similar products: " + e.getMessage())
                    .sourceProductId(productId)
                    .build();
        }
    }

    private String createProductTextForSimilarity(ProductDto product) {
        StringBuilder queryText = new StringBuilder();

        if (product.getName() != null) {
            queryText.append(product.getName()).append(" ");
        }

        if (product.getDescription() != null) {
            queryText.append(product.getDescription()).append(" ");
        }

        // Add category and brand names if available
        String categoryName = fetchCategoryName(product.getCategoryId());
        if (categoryName != null) {
            queryText.append(categoryName).append(" ");
        }

        String brandName = fetchBrandName(product.getBrandId());
        if (brandName != null) {
            queryText.append(brandName);
        }

        return queryText.toString().trim();
    }

    private List<ProductDto> convertDocumentsToProductDtos(List<Document> documents, UUID excludeProductId, int limit) {
        return documents.stream()
                .filter(doc -> {
                    String docProductId = doc.getMetadata().get("productId").toString();
                    return !excludeProductId.toString().equals(docProductId);
                })
                .limit(limit)
                .map(this::convertDocumentToProductDto)
                .filter(dto -> dto != null)
                .collect(java.util.stream.Collectors.toList());
    }

    private ProductDto convertDocumentToProductDto(Document document) {
        try {
            String productIdStr = document.getMetadata().get("productId").toString();
            UUID productId = UUID.fromString(productIdStr);

            // Get full product details
            ProductDto product = productService.getProductById(productId, null);

            if (product == null) {
                log.warn("Product not found for ID: {}", productId);
                return null;
            }

            // Return the existing ProductDto as is - it already contains all necessary fields
            return product;

        } catch (Exception e) {
            log.error("Error converting document to ProductDto: {}", e.getMessage(), e);
            return null;
        }
    }

    private Double extractSimilarityScore(Document document) {
        // Spring AI VectorStore might include similarity score in metadata
        Object score = document.getMetadata().get("score");
        if (score != null && score instanceof Number) {
            return ((Number) score).doubleValue();
        }
        return 0.8; // Default similarity score
    }

    private String truncateDescription(String description, int maxLength) {
        if (description == null || description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    }

    private String generateSlug(String name) {
        if (name == null) return null;
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String formatPrice(java.math.BigDecimal price) {
        if (price == null) return null;
        return String.format("$%.2f", price);
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

