package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ProductDescriptionRequestDto;
import com.ainan.ecommforallbackend.dto.ProductDescriptionResponseDto;
import com.ainan.ecommforallbackend.dto.ProductVariantDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final ChatModel chatModel;

    /**
     * Generate product description using AI
     * 
     * @param request ProductDescriptionRequestDto containing product details
     * @return ProductDescriptionResponseDto with generated description
     */
    public ProductDescriptionResponseDto generateProductDescription(ProductDescriptionRequestDto request) {
        try {
            log.info("Generating product description for: {}", request.getProductName());

            String prompt = buildPrompt(request);
            String generatedDescription = chatModel.call(prompt);

            return ProductDescriptionResponseDto.success(
                    generatedDescription,
                    request.getExistingDescription(),
                    request.getTone() != null ? request.getTone() : "professional");

        } catch (Exception e) {
            log.error("Error generating product description: {}", e.getMessage(), e);
            return ProductDescriptionResponseDto.error("Failed to generate product description: " + e.getMessage());
        }
    }

    /**
     * Build AI prompt for product description generation
     */
    private String buildPrompt(ProductDescriptionRequestDto request) {
        StringBuilder promptBuilder = new StringBuilder();

        promptBuilder.append("Generate a compelling product description for an e-commerce website.\n\n");
        promptBuilder.append("Product Name: ").append(request.getProductName()).append("\n");

        if (request.getCategory() != null) {
            promptBuilder.append("Category: ").append(request.getCategory()).append("\n");
        }

        if (request.getBrand() != null) {
            promptBuilder.append("Brand: ").append(request.getBrand()).append("\n");
        }

        if (request.getExistingDescription() != null && !request.getExistingDescription().trim().isEmpty()) {
            promptBuilder.append("Existing Description (improve this): ").append(request.getExistingDescription())
                    .append("\n");
        }

        if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
            promptBuilder.append("Attributes: ");
            String attrs = request.getAttributes().entrySet().stream()
                    .map(entry -> entry.getKey() + ": " + entry.getValue())
                    .collect(Collectors.joining(", "));
            promptBuilder.append(attrs).append("\n");
        }

        if (request.getTargetAudience() != null) {
            promptBuilder.append("Target Audience: ").append(request.getTargetAudience()).append("\n");
        }

        // Handle variant information
        if (request.getHasVariants() != null && request.getHasVariants() &&
                request.getVariants() != null && !request.getVariants().isEmpty()) {

            promptBuilder.append("\nProduct Variants:\n");

            for (int i = 0; i < request.getVariants().size(); i++) {
                ProductVariantDto variant = request.getVariants().get(i);
                promptBuilder.append("Variant ").append(i + 1).append(":\n");

                if (variant.getAttributeValues() != null && !variant.getAttributeValues().isEmpty()) {
                    promptBuilder.append("  Attributes: ");
                    variant.getAttributeValues()
                            .forEach((key, value) -> promptBuilder.append(key).append(": ").append(value).append(", "));
                    // Remove the last comma and space
                    if (promptBuilder.length() > 2) {
                        promptBuilder.setLength(promptBuilder.length() - 2);
                    }
                    promptBuilder.append("\n");
                }

                if (variant.getPrice() != null) {
                    promptBuilder.append("  Price: $").append(variant.getPrice()).append("\n");
                }

                    promptBuilder.append("  Stock: ").append(variant.getStock()).append(" units\n");

                promptBuilder.append("\n");
            }

            promptBuilder.append("Note: This product comes in multiple variants. ");
            promptBuilder.append("Mention the available options without being too specific about pricing. ");
            promptBuilder.append("Focus on the variety and choice available to customers.\n");
        }

        promptBuilder.append("\nRequirements:\n");
        promptBuilder.append("- Tone: ").append(request.getTone() != null ? request.getTone() : "professional")
                .append("\n");
        promptBuilder.append("- Maximum length: ").append(request.getMaxLength() != null ? request.getMaxLength() : 150)
                .append(" words\n");
        promptBuilder.append("- Focus on benefits and value proposition\n");
        promptBuilder.append("- Make it SEO-friendly and engaging\n");
        promptBuilder.append("- Use persuasive language that encourages purchase\n");
        promptBuilder.append("- Avoid technical jargon unless the tone is 'technical'\n");
        promptBuilder.append("- Include a clear call-to-action if appropriate\n\n");

        promptBuilder.append(
                "Generate only the product description text, without any additional formatting or explanations.");

        return promptBuilder.toString();
    }
}
