package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.EmbeddingSyncResponseDto;
import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductEmbeddingService {

    private final ProductRepository productRepository;
    private final EmbeddingModel embeddingModel;
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

            // Store in VectorStore (this automatically creates embeddings)
            vectorStore.add(List.of(document));

            log.info("Successfully indexed product: {} in VectorStore", productId);
        } catch (Exception e) {
            log.error("Failed to index product {}: {}", productId, e.getMessage(), e);
            throw e;
        }
    }

    public EmbeddingSyncResponseDto syncAllProducts() {
        log.info("Starting product embedding sync using VectorStore...");

        List<Product> allProducts = productRepository.findAll();
        // check existing embeddings first

        int indexed = 0, skipped = 0, failed = 0;
        log.info("Starting to process {} products for embedding", allProducts.size());

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
        if (product.getName() != null) desc.append(product.getName()).append(" ");
        if (product.getDescription() != null) desc.append(product.getDescription()).append(" ");
        if (product.getCategory() != null) desc.append(product.getCategory().getName()).append(" ");
        if (product.getBrand() != null) desc.append(product.getBrand().getName()).append(" ");
        return desc.toString().trim();
    }
}