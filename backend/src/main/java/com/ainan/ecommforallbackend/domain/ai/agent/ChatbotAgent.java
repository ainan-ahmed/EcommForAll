package com.ainan.ecommforallbackend.domain.ai.agent;

import com.ainan.ecommforallbackend.core.util.PromptTemplates;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentRequest;
import com.ainan.ecommforallbackend.domain.ai.agent.base.BaseAgent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;

import java.util.Map;

/**
 * Agent for customer service chatbot interactions.
 * Handles conversational queries and product assistance.
 */
@Slf4j
public class ChatbotAgent extends BaseAgent {

    private ChatMemory chatMemory;
    private String conversationId;

    public ChatbotAgent(ChatClient chatClient) {
        super(chatClient);
    }

    @Override
    protected String getAgentName() {
        return "ChatbotAgent";
    }

    @Override
    protected void validateRequest(AgentRequest request) {
        if (request.getInput() == null || request.getInput().isEmpty()) {
            throw new IllegalArgumentException("Request input cannot be empty");
        }

        Object message = request.getInputValue("message");
        if (message == null || message.toString().trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
    }

    @Override
    protected void setupAgent(AgentRequest request) {
        Object memoryObj = request.getContextValue("chatMemory");
        Object conversationIdObj = request.getContextValue("conversationId");

        if (memoryObj instanceof ChatMemory) {
            this.chatMemory = (ChatMemory) memoryObj;
        }

        if (conversationIdObj != null) {
            this.conversationId = conversationIdObj.toString();
        }
    }

    @Override
    protected String buildSystemPrompt() {
        return PromptTemplates.defaultChatBotPrompt;
    }

    @Override
    protected String buildUserPrompt(AgentRequest request) {
        String message = request.getInputValue("message").toString();
        String intent = analyzeIntent(message);
        
        log.info("Chatbot intent detected: {}", intent);
        
        return buildIntentSpecificPrompt(message, intent);
    }

    @Override
    protected String callAI(String systemPrompt, String userPrompt, Map<String, Object> params) {
        try {
            if (chatMemory != null && conversationId != null) {
                return chatClient.prompt()
                        .system(systemPrompt)
                        .user(userPrompt)
                        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                        .call()
                        .content();
            }

            return super.callAI(systemPrompt, userPrompt, params);
        } catch (Exception e) {
            log.error("Error calling AI: {}", e.getMessage(), e);
            throw new RuntimeException("AI call failed: " + e.getMessage(), e);
        }
    }

    private String buildIntentSpecificPrompt(String userMessage, String intent) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Customer Intent: ").append(intent).append("\n\n");

        // Add context based on intent
        switch (intent) {
            case "PRODUCT_SEARCH":
                prompt.append("The customer is looking for specific products. Help them find what they need.\n");
                break;
            case "PRODUCT_COMPARISON":
                prompt.append("The customer wants to compare products. Help them compare features, prices, and benefits.\n");
                break;
            case "RECOMMENDATION":
                prompt.append("The customer wants product recommendations. Suggest featured products or search based on their preferences.\n");
                break;
            case "CATEGORY_BROWSE":
                prompt.append("The customer is browsing by category. Help them explore products in specific categories.\n");
                break;
            default:
                prompt.append("Provide helpful assistance based on the customer's request.\n");
                break;
        }

        prompt.append("\nCustomer Message: ").append(userMessage);

        return prompt.toString();
    }

    private String analyzeIntent(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("product") || lowerMessage.contains("search") || lowerMessage.contains("find")) {
            return "PRODUCT_SEARCH";
        } else if (lowerMessage.contains("compare") || lowerMessage.contains("vs") || lowerMessage.contains("difference")) {
            return "PRODUCT_COMPARISON";
        } else if (lowerMessage.contains("recommend") || lowerMessage.contains("suggest") || lowerMessage.contains("best")) {
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
}
