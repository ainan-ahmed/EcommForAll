package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.EmbeddingSyncResponseDto;
import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductEmbeddingService {

    private static final Duration EMBEDDING_TIMEOUT = Duration.ofSeconds(10);

    private final ProductRepository productRepository;
    private final VectorStore vectorStore;

    public void indexProduct(UUID productId, String description) {
        try {
            log.info("Attempting to create embedding for product: {}", productId);
            log.debug("Description text: {}", description);

            // Create a Document for the VectorStore
            Document document = new Document(
                    description,
                    Map.of(
                            "productId", productId.toString(),
                            "type", "product",
                            "content", description
                    )
            );

            // Store in VectorStore (this automatically creates embeddings) with timeout protection
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> vectorStore.add(List.of(document)));
            future.get(EMBEDDING_TIMEOUT.toMillis(), TimeUnit.MILLISECONDS);

            log.info("Successfully indexed product: {} in VectorStore", productId);
        } catch (Exception e) {
            log.error("Failed to index product {}: {}", productId, e.getMessage(), e);
            throw new RuntimeException("Embedding service timeout or failure for product " + productId, e);
        }
    }

    public EmbeddingSyncResponseDto syncAllProducts() {
        log.info("Starting product embedding sync using VectorStore...");

        List<Product> allProducts = productRepository.findAll();
        // check existing embeddings first
        if (allProducts.isEmpty()) {
            log.info("No products found to index. Exiting sync.");
            return new EmbeddingSyncResponseDto(0, 0, 0, 0);
        }

        int indexed = 0, skipped = 0, failed = 0;
        log.info("Starting to process {} products for embedding", allProducts.size());
        try {
            log.info("Clearing existing embeddings from VectorStore...");
            vectorStore.delete(List.of()); // This deletes all documents
            log.info("Successfully cleared existing embeddings");
        } catch (Exception e) {
            log.error("Failed to clear existing embeddings: {}", e.getMessage(), e);
            // Continue with indexing even if deletion fails
        }
        for (Product product : allProducts) {
            try {
                log.info("Processing product: {} ({})", product.getId(), product.getName());
                String description = buildProductDescription(product);
                if (description != null && !description.trim().isEmpty()) {
                    indexProduct(product.getId(), description);
                    indexed++;
                } else {
                    log.warn("Skipping product {} - empty description", product.getId());
                    skipped++;
                }
            } catch (Exception e) {
                log.error("Failed to index product {}: {}", product.getId(), e.getMessage(), e);
                failed++;
            }
        }

        log.info("VectorStore sync completed. Indexed: {}, Skipped: {}, Failed: {}",
                indexed, skipped, failed);
        return new EmbeddingSyncResponseDto(0, indexed, skipped, failed);
    }

    private String buildProductDescription(Product product) {
        StringBuilder desc = new StringBuilder();

        // Basic product information
        if (product.getName() != null) {
            desc.append("Product: ").append(product.getName()).append(". ");
        }

        if (product.getDescription() != null) {
            desc.append("Description: ").append(product.getDescription()).append(". ");
        }

        // Category information
        if (product.getCategory() != null) {
            desc.append("Category: ").append(product.getCategory().getName()).append(". ");
        }

        // Brand information
        if (product.getBrand() != null) {
            desc.append("Brand: ").append(product.getBrand().getName()).append(". ");
        }

        // SKU information
        if (product.getSku() != null) {
            desc.append("SKU: ").append(product.getSku()).append(". ");
        }

        // Price and stock information
        if (product.hasVariants()) {
            desc.append("This product has multiple variants. ");

            // Add variant information
            if (product.getVariants() != null && !product.getVariants().isEmpty()) {
                desc.append("Available variants: ");

                for (int i = 0; i < product.getVariants().size(); i++) {
                    var variant = product.getVariants().get(i);

                    if (i > 0) desc.append(", ");

                    // Add variant attributes (color, size, etc.)
                    if (variant.getAttributeValues() != null && !variant.getAttributeValues().isEmpty()) {
                        desc.append("(");
                        variant.getAttributeValues().forEach((key, value) ->
                                desc.append(key).append(": ").append(value).append(" ")
                        );
                        desc.append(")");
                    }

                    // Add variant price and stock
                    if (variant.getPrice() != null) {
                        desc.append(" $").append(variant.getPrice());
                    }

                    if (variant.getStock() != null) {
                        desc.append(" (").append(variant.getStock()).append(" in stock)");
                    }
                }
                desc.append(". ");
            }

            // Add price range
            if (product.getMinPrice() != null) {
                desc.append("Starting from $").append(product.getMinPrice()).append(". ");
            }

            // Add total stock
            Integer totalStock = product.getEffectiveStock();
            if (totalStock != null && totalStock > 0) {
                desc.append("Total stock: ").append(totalStock).append(" units. ");
            }
        } else {
            // Single product without variants
            if (product.getPrice() != null) {
                desc.append("Price: $").append(product.getPrice()).append(". ");
            }

            if (product.getStock() != null) {
                desc.append("Stock: ").append(product.getStock()).append(" units. ");
            }
        }

        // Product status
        if (product.getIsActive() != null && product.getIsActive()) {
            desc.append("Available for purchase. ");
        } else {
            desc.append("Currently unavailable. ");
        }

        if (product.getIsFeatured() != null && product.getIsFeatured()) {
            desc.append("Featured product. ");
        }

        // Availability status
        if (product.isInStock()) {
            desc.append("In stock. ");
        } else {
            desc.append("Out of stock. ");
        }

        // Seller information
        if (product.getSeller() != null) {
            String sellerName = product.getSeller().getFirstName() != null && product.getSeller().getLastName() != null
                    ? product.getSeller().getFirstName() + " " + product.getSeller().getLastName()
                    : product.getSeller().getUsername();
            desc.append("Sold by: ").append(sellerName).append(". ");
        }

        return desc.toString().trim();
    }
}