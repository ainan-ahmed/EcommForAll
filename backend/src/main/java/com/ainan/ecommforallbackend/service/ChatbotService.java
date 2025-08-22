package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.ChatRequestDto;
import com.ainan.ecommforallbackend.dto.ChatResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatbotService {

    private final ChatClient chatbotClient;
    private final ChatMemory chatMemory;

    public ChatResponseDto processMessage(ChatRequestDto request) {
        UUID conversationId = request.getConversationId();
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                throw new IllegalArgumentException("Message cannot be empty");
            }
            // Analyze intent for response categorization
            String intent = analyzeIntent(request.getMessage());
            log.info("Chatbot intent detected: {}", intent);

            // Build a simpler user prompt that works better with Vertex AI
            String userPrompt = request.getMessage(); // Use the raw message directly
            log.info("Chatbot user prompt generated: {}", userPrompt);

            if (userPrompt.trim().isEmpty()) {
                throw new IllegalArgumentException("User prompt cannot be empty");
            }
            log.info("Processing: {}", request);

            // Get AI response - Use the most minimal approach possible to avoid "parts
            // field" error
            String aiResponse;
            try {
                // Try the absolute simplest call possible but with memory
                aiResponse = chatbotClient.prompt()
                        .user(userPrompt)
                        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId.toString()))
                        .call()
                        .content();

                log.info("AI response received successfully: {}",
                        aiResponse != null ? aiResponse.substring(0, Math.min(50, aiResponse.length())) + "..."
                                : "null");
            } catch (Exception vertexError) {
                log.error("Vertex AI call failed with error: {}", vertexError.getMessage());

                // If even the simplest call fails, it's a fundamental Spring AI + Vertex AI
                // compatibility issue
                if (vertexError.getMessage().contains("parts field")) {
                    throw new RuntimeException("Spring AI 1.0.1 has a compatibility issue with Vertex AI Gemini. " +
                            "The request format is not properly constructed. Consider using a different AI provider or updating Spring AI version.",
                            vertexError);
                } else {
                    throw vertexError;
                }
            }

            // Parse response for UI actions (using simplified intent)
            ChatResponseDto response = parseAgentResponse(
                    conversationId,
                    aiResponse,
                    intent);

            log.info("Chat response generated for conversation: {}", conversationId);
            return response;

        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());

            // For validation errors, don't store anything in memory
            return ChatResponseDto.error(
                    conversationId != null ? conversationId : UUID.randomUUID(),
                    "Please provide a valid message.");
        } catch (Exception e) {
            log.error("Error processing chat message for conversation {}: {}", conversationId, e.getMessage(), e);

            // CRITICAL: Remove the user message that was auto-stored but failed to process
            if (conversationId != null) {
                removeLastUserMessageFromMemory(conversationId);
            }

            return ChatResponseDto.error(
                    conversationId != null ? conversationId : UUID.randomUUID(),
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

    private void removeLastUserMessageFromMemory(UUID conversationId) {
        try {
            // Get current conversation history
            List<Message> messages = chatMemory.get(conversationId.toString());

            if (!messages.isEmpty()) {
                // Remove the last message if it's from user (the failed one)
                Message lastMessage = messages.get(messages.size() - 1);
                if (lastMessage.getMessageType() == MessageType.USER) {
                    // Clear and rebuild memory without the last user message
                    chatMemory.clear(conversationId.toString());

                    // Re-add all messages except the last one
                    for (int i = 0; i < messages.size() - 1; i++) {
                        chatMemory.add(conversationId.toString(), messages.get(i));
                    }

                    log.info("Removed failed user message from conversation: {}", conversationId);
                }
            }
        } catch (Exception e) {
            log.error("Error removing failed message from memory: {}", e.getMessage());
        }
    }
}