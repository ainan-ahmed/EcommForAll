package com.ainan.ecommforallbackend.domain.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductFilterDto;
import com.ainan.ecommforallbackend.domain.product.service.ProductService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatbotTools {

    private final ProductService productService;
    private final VectorStore vectorStore;

    @Tool(description = "Search products in the database based on various criteria including price range")
    public String searchProducts(
            @ToolParam(description = "Product name or keyword to search for") String query,
            @ToolParam(description = "Maximum price constraint - extract from phrases like 'under $100', 'below 50'\"") Double maxPrice,
            @ToolParam(description = "Number of results to return (default 5)") int limit) {
        try {
            // If only price filtering is needed and no specific query
            if ((query == null || query.trim().isEmpty() || query.trim().equals("products")) && maxPrice != null) {
                ProductFilterDto filter = new ProductFilterDto();
                filter.setMaxPrice(BigDecimal.valueOf(maxPrice));
                filter.setIsActive(true);

                var products = productService.getFilteredProducts(filter, PageRequest.of(0, limit));

                if (products.isEmpty()) {
                    return String.format("No products found under $%.2f", maxPrice);
                }

                StringBuilder resultStr = new StringBuilder();
                resultStr.append(String.format("Here are %d products under $%.2f:\n", products.getContent().size(), maxPrice));
                for (ProductDto product : products.getContent()) {
                    resultStr.append(String.format("- %s ($%.2f) - %s\n",
                            product.getName(),
                            product.getMinPrice(),
                            product.getDescription() != null ?
                                    (product.getDescription().length() > 100 ?
                                            product.getDescription().substring(0, 100) + "..." :
                                            product.getDescription()) : "No description"));
                }
                return resultStr.toString();
            }

            // For text-based search, use vector store
            if (query != null && !query.trim().isEmpty()) {
                List<Document> result = vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(query)
                                .topK(limit)
                                .build()
                );

                List<ProductDto> products = result.stream()
                        .map(document -> {
                            String productIdStr = (String) document.getMetadata().get("productId");
                            if (productIdStr != null) {
                                try {
                                    UUID productId = UUID.fromString(productIdStr);
                                    ProductDto product = productService.getProductById(productId, null);
                                    // Apply price filter if specified
                                    if (maxPrice != null && product.getMinPrice().doubleValue() > maxPrice) {
                                        return null;
                                    }
                                    return product;
                                } catch (Exception e) {
                                    log.warn("Failed to fetch product with ID {}: {}", productIdStr, e.getMessage());
                                    return null;
                                }
                            }
                            return null;
                        })
                        .filter(Objects::nonNull)
                        .toList();

                if (products.isEmpty()) {
                    return String.format("No products found for \"%s\"" + (maxPrice != null ? " under $%.2f" : ""), query, maxPrice);
                }

                StringBuilder resultStr = new StringBuilder();
                resultStr.append(String.format("Search results for \"%s\":\n", query));
                for (ProductDto product : products) {
                    resultStr.append(String.format("- %s ($%.2f) - %s\n",
                            product.getName(),
                            product.getMinPrice(),
                            product.getDescription() != null ?
                                    (product.getDescription().length() > 100 ?
                                            product.getDescription().substring(0, 100) + "..." :
                                            product.getDescription()) : "No description"));
                }
                return resultStr.toString();
            }

            return "Please provide either a search query or price criteria.";

        } catch (Exception e) {
            log.error("Error searching products: {}", e.getMessage(), e);
            return "Sorry, I encountered an error while searching for products. Please try again.";
        }
    }

    @Tool(description = "Get detailed product information")
    public String getProductDetails(String productId) {
        try {
            UUID id = UUID.fromString(productId.replace("\"", "").trim());
            ProductDto product = productService.getProductById(id, List.of("images", "variants"));

            StringBuilder details = new StringBuilder();
            details.append(String.format("Product: %s\n", product.getName()));
            details.append(String.format("Description: %s\n", product.getDescription()));
            details.append(String.format("Price: $%.2f\n", product.getMinPrice()));
            details.append(String.format("Active: %s\n", product.getIsActive() ? "Yes" : "No"));

            if (product.getVariants() != null && !product.getVariants().isEmpty()) {
                details.append("Variants available: ").append(product.getVariants().size()).append("\n");
            }

            return details.toString();

        } catch (Exception e) {
            log.error("Error getting product details: {}", e.getMessage(), e);
            return "Error getting product details: " + e.getMessage();
        }
    }

    @Tool(description = "Get featured products")
    public String getFeaturedProducts() {
        try {
            var featuredProducts = productService.getFeaturedProducts(PageRequest.of(0, 5));

            if (featuredProducts.isEmpty()) {
                return "No featured products available at the moment.";
            }

            StringBuilder result = new StringBuilder("Featured products:\n");
            featuredProducts.getContent().forEach(product -> result.append(String.format("- %s ($%.2f) - ID: %s\n",
                    product.getName(),
                    product.getMinPrice(),
                    product.getId())));

            return result.toString();

        } catch (Exception e) {
            log.error("Error getting featured products: {}", e.getMessage(), e);
            return "Error getting featured products: " + e.getMessage();
        }
    }

    @Tool(description = "Get products by category")
    public String getProductsByCategory(String categoryId) {
        try {
            UUID id = UUID.fromString(categoryId.replace("\"", "").trim());
            var products = productService.getProductsByCategoryId(id, PageRequest.of(0, 5));

            if (products.isEmpty()) {
                return "No products found in this category.";
            }

            StringBuilder result = new StringBuilder("Products in category:\n");
            products.getContent().forEach(product -> result.append(String.format("- %s ($%.2f) - ID: %s\n",
                    product.getName(),
                    product.getMinPrice(),
                    product.getId())));

            return result.toString();

        } catch (Exception e) {
            log.error("Error getting products by category: {}", e.getMessage(), e);
            return "Error getting products by category: " + e.getMessage();
        }
    }

    @Tool(description = "Compare two products")
    public String compareProducts(String productIds) {
        try {
            String[] ids = productIds.split(",");
            if (ids.length != 2) {
                return "Please provide exactly two product IDs to compare.";
            }

            UUID productId1 = UUID.fromString(ids[0].trim());
            UUID productId2 = UUID.fromString(ids[1].trim());

            ProductDto product1 = productService.getProductById(productId1, List.of());
            ProductDto product2 = productService.getProductById(productId2, List.of());

            StringBuilder comparison = new StringBuilder("Product Comparison:\n\n");
            comparison.append(String.format("Product 1: %s\n", product1.getName()));
            comparison.append(String.format("- Price: $%.2f\n", product1.getMinPrice()));
            comparison.append(String.format("- Description: %s\n\n", product1.getDescription()));

            comparison.append(String.format("Product 2: %s\n", product2.getName()));
            comparison.append(String.format("- Price: $%.2f\n", product2.getMinPrice()));
            comparison.append(String.format("- Description: %s\n\n", product2.getDescription()));

            if (product1.getMinPrice().compareTo(product2.getMinPrice()) < 0) {
                comparison.append(String.format("%s is cheaper by $%.2f\n",
                        product1.getName(), product2.getMinPrice().subtract(product1.getMinPrice())));
            } else if (product1.getMinPrice().compareTo(product2.getMinPrice()) > 0) {
                comparison.append(String.format("%s is cheaper by $%.2f\n",
                        product2.getName(), product1.getMinPrice().subtract(product2.getMinPrice())));
            } else {
                comparison.append("Both products have the same price.\n");
            }

            return comparison.toString();

        } catch (Exception e) {
            log.error("Error comparing products: {}", e.getMessage(), e);
            return "Error comparing products: " + e.getMessage();
        }
    }
}