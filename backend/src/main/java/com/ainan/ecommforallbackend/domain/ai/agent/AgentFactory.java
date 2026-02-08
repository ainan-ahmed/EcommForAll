package com.ainan.ecommforallbackend.domain.ai.agent;

import com.ainan.ecommforallbackend.domain.ai.agent.ChatbotAgent;
import com.ainan.ecommforallbackend.domain.ai.agent.ProductDescriptionAgent;
import com.ainan.ecommforallbackend.domain.brand.service.BrandService;
import com.ainan.ecommforallbackend.domain.category.service.CategoryService;
import com.ainan.ecommforallbackend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

/**
 * Factory for creating AI agent instances.
 * Centralizes agent instantiation and dependency injection.
 * Usage: AgentFactory.createProductDescriptionAgent(...)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AgentFactory {

    private final ChatClient chatClient;
    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private final VectorStore vectorStore;

    /**
     * Create a ProductDescriptionAgent instance.
     * This agent generates or improves product descriptions.
     */
    public ProductDescriptionAgent createProductDescriptionAgent() {
        log.debug("Creating ProductDescriptionAgent");
        return new ProductDescriptionAgent(
                chatClient,
                productService,
                brandService,
                categoryService);
    }

    /**
     * Create a ChatbotAgent instance.
     * This agent handles customer service conversations.
     */
    public ChatbotAgent createChatbotAgent() {
        log.debug("Creating ChatbotAgent");
        return new ChatbotAgent(chatClient);
    }

    /**
     * Create a SimilarProductsAgent instance.
     * This agent finds products similar to a given product.
     */
    // public SimilarProductsAgent createSimilarProductsAgent() {
    //     log.debug("Creating SimilarProductsAgent");
    //     return new SimilarProductsAgent(
    //             chatClient,
    //             productService,
    //             brandService,
    //             categoryService,
    //             vectorStore);
    // }

    /**
     * Get an agent by name.
     * Useful for dynamic agent loading.
     */
    public Object createAgent(String agentName) {
        return switch (agentName.toUpperCase()) {
            case "PRODUCT_DESCRIPTION" -> createProductDescriptionAgent();
            case "CHATBOT" -> createChatbotAgent();
            // case "SIMILAR_PRODUCTS" -> createSimilarProductsAgent();
            default -> throw new IllegalArgumentException("Unknown agent: " + agentName);
        };
    }
}
