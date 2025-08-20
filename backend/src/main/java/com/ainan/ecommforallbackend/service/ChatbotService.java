package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ChatRequestDto;
import com.ainan.ecommforallbackend.dto.ChatResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatbotService {

    private final ChatClient chatbotClient;

    public ChatResponseDto processMessage(ChatRequestDto request) {
        try {

            // Generate or use provided conversation ID
            UUID conversationId = request.getConversationId();
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                throw new IllegalArgumentException("Message cannot be empty");
            }
            // Analyze intent for response categorization
            String intent = analyzeIntent(request.getMessage());
            log.info("Chatbot intent detected: {}", intent);

            // Build user prompt with intent context
            String userPrompt = buildUserPrompt(request.getMessage(), intent);
            log.info("Chatbot user prompt generated: {}", userPrompt);
            if (userPrompt.trim().isEmpty()) {
                throw new IllegalArgumentException("User prompt cannot be empty");
            }
            log.info("Processing: {}", request);
            log.info("Chatbot user prompt generated: {}", userPrompt);
            
            // Get AI response - Tools are already configured in ChatClient
            String aiResponse = chatbotClient.prompt()
                    .user(userPrompt)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId.toString()))
                    .call()
                    .content();

            // Parse response for UI actions
            ChatResponseDto response = parseAgentResponse(
                    conversationId,
                    aiResponse,
                    intent);

            log.info("Chat response generated for conversation: {}", conversationId);
            return response;

        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ChatResponseDto.error(
                    UUID.randomUUID(),
                    "Please provide a valid message.");
        } catch (Exception e) {
            log.error("Error processing chat message: {}", e.getMessage(), e);
            return ChatResponseDto.error(
                    UUID.randomUUID(),
                    "I apologize, but I'm having trouble processing your request right now. Please try again later.");
        }
    }

    private String analyzeIntent(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("product") || lowerMessage.contains("search") || lowerMessage.contains("find")) {
            return "PRODUCT_SEARCH";
        } else if (lowerMessage.contains("compare") || lowerMessage.contains("vs")
                || lowerMessage.contains("difference")) {
            return "PRODUCT_COMPARISON";
        } else if (lowerMessage.contains("recommend") || lowerMessage.contains("suggest")
                || lowerMessage.contains("best")) {
            return "RECOMMENDATION";
        } else if (lowerMessage.contains("category") || lowerMessage.contains("type")) {
            return "CATEGORY_BROWSE";
        } else if (lowerMessage.contains("brand") || lowerMessage.contains("make")) {
            return "BRAND_INQUIRY";
        } else if (lowerMessage.contains("price") || lowerMessage.contains("cost") || lowerMessage.contains("cheap")) {
            return "PRICE_INQUIRY";
        } else {
            return "GENERAL";
        }
    }

    private String buildUserPrompt(String userMessage, String intent) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Customer Intent: ").append(intent).append("\n\n");

        // Add context based on intent
        switch (intent) {
            case "PRODUCT_SEARCH":
                prompt.append(
                        "The customer is looking for specific products. Use search tools to help them find what they need.\n");
                break;
            case "PRODUCT_COMPARISON":
                prompt.append(
                        "The customer wants to compare products. Help them compare features, prices, and benefits.\n");
                break;
            case "RECOMMENDATION":
                prompt.append(
                        "The customer wants product recommendations. Suggest featured products or search based on their preferences.\n");
                break;
            case "CATEGORY_BROWSE":
                prompt.append(
                        "The customer is browsing by category. Help them explore products in specific categories.\n");
                break;
            default:
                prompt.append("Provide helpful assistance based on the customer's request.\n");
                break;
        }

        prompt.append("\nCustomer Message: ").append(userMessage).append("\n\n");

        // Pattern to match price expressions
        if (userMessage.toLowerCase().matches(".*\\b(under|below|less than|max|maximum)\\s*\\$?\\d+.*")) {
            prompt.append("Please use the maxPrice parameter when searching");
        }
        return prompt.toString();
    }

    private ChatResponseDto parseAgentResponse(UUID sessionId, String response, String intent) {
        ChatResponseDto dto = ChatResponseDto.success(sessionId, response, intent);

        // Check if response contains product information that might need UI action
        String lowerResponse = response.toLowerCase();
        if (lowerResponse.contains("found products") || lowerResponse.contains("product:")
                || lowerResponse.contains("featured products") || lowerResponse.contains("- id:")) {
            dto.setRequiresAction(true);
            dto.setActionType("SHOW_PRODUCTS");
        } else if (lowerResponse.contains("comparison:") || lowerResponse.contains("product 1:")) {
            dto.setRequiresAction(true);
            dto.setActionType("SHOW_COMPARISON");
        }

        return dto;
    }
}