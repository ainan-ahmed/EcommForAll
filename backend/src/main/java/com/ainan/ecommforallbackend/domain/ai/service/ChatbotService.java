package com.ainan.ecommforallbackend.domain.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ainan.ecommforallbackend.domain.ai.agent.AgentFactory;
import com.ainan.ecommforallbackend.domain.ai.agent.ChatbotAgent;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentRequest;
import com.ainan.ecommforallbackend.domain.ai.agent.base.AgentResponse;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatHistoryMessageDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatHistoryResponseDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatRequestDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatResponseDto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatbotService {

    private final AgentFactory agentFactory;
    private final ChatMemory chatMemory;

    public ChatResponseDto processMessage(ChatRequestDto request) {
        UUID conversationId = request.getConversationId();
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                throw new IllegalArgumentException("Message cannot be empty");
            }

            ChatbotAgent agent = agentFactory.createChatbotAgent();

            AgentRequest agentRequest = AgentRequest.builder()
                    .requestType("CHATBOT_MESSAGE")
                    .input(Map.of("message", request.getMessage()))
                    .context(Map.of(
                            "conversationId", conversationId,
                            "chatMemory", chatMemory
                    ))
                    .build();

            AgentResponse agentResponse = agent.execute(agentRequest);

            if (!agentResponse.isSuccess()) {
                throw new RuntimeException(agentResponse.getErrorMessage());
            }

            ChatResponseDto response = parseAgentResponse(
                    conversationId,
                    agentResponse.getContent(),
                    "GENERAL" // or let agent return intent in metadata
            );

            return response;

        } catch (Exception e) {
            log.error("Error processing chat message for conversation {}: {}", conversationId, e.getMessage(), e);

            if (conversationId != null) {
                removeLastUserMessageFromMemory(conversationId, request.getMessage());
            }

            return ChatResponseDto.error(
                    conversationId != null ? conversationId : UUID.randomUUID(),
                    "I apologize, but I'm having trouble processing your request right now. Please try again later.");
        }
    }

    public ChatHistoryResponseDto getConversation(UUID conversationId) {
        List<Message> history = chatMemory.get(conversationId.toString());

        if (history.isEmpty()) {
            ChatHistoryResponseDto emptyResponse = new ChatHistoryResponseDto();
            emptyResponse.setConversationId(conversationId);
            emptyResponse.setMessages(new ArrayList<>());
            return emptyResponse;
        }

        return convertToChatHistoryWithMetadata(conversationId.toString(), history);
    }

    public void clearConversation(String conversationId) {
        chatMemory.clear(conversationId);
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

    private void removeLastUserMessageFromMemory(UUID conversationId, String userMessage) {
        try {
            // check whether last message is actually last valid message, or the failed one

            // Get current conversation history
            List<Message> messages = chatMemory.get(conversationId.toString());

            if (!messages.isEmpty()) {
                // Remove the last message if it's from user (the failed one)
                Message lastMessage = messages.get(messages.size() - 1);
                if (lastMessage.getMessageType() == MessageType.USER && lastMessage.getText().equals(userMessage)) {
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

    private ChatHistoryResponseDto convertToChatHistoryWithMetadata(String conversationId, List<Message> messages) {
        ChatHistoryResponseDto response = new ChatHistoryResponseDto();
        response.setConversationId(parseConversationId(conversationId));
        response.setMessages(new ArrayList<>());

        Instant baseTime = Instant.now().minusSeconds(messages.size() * 60);

        for (int i = 0; i < messages.size(); i++) {
            Message message = messages.get(i);

            if (message.getMessageType() == MessageType.SYSTEM) {
                continue;
            }

            ChatHistoryMessageDto historyMessage = new ChatHistoryMessageDto();

            String content = cleanMessageContent(message);
            historyMessage.setContent(content);

            Instant messageTime = getMessageTimestamp(message, baseTime.plusSeconds(i * 60));
            historyMessage.setTimestamp(messageTime);

            historyMessage.setSender(mapMessageTypeToSender(message.getMessageType()));

            response.getMessages().add(historyMessage);
        }

        return response;
    }

    private String cleanMessageContent(Message message) {
        String content = message.getText();

        if (message.getMessageType() == MessageType.USER && content.contains("Customer Intent:")) {
            if (content.contains("Customer Message: ")) {
                content = content.substring(content.lastIndexOf("Customer Message: ") + 18).trim();
            }
        }

        return content;
    }

    private Instant getMessageTimestamp(Message message, Instant fallbackTime) {
        if (message.getMetadata() != null && message.getMetadata().containsKey("timestamp")) {
            try {
                Object timestamp = message.getMetadata().get("timestamp");
                if (timestamp instanceof LocalDateTime) {
                    return ((LocalDateTime) timestamp).atZone(ZoneId.systemDefault()).toInstant();
                } else if (timestamp instanceof String) {
                    LocalDateTime parsedDateTime = LocalDateTime.parse((String) timestamp);
                    return parsedDateTime.atZone(ZoneId.systemDefault()).toInstant();
                }
            } catch (Exception e) {
                log.debug("Could not parse timestamp from message metadata: {}", e.getMessage());
            }
        }

        return fallbackTime;
    }

    private String mapMessageTypeToSender(MessageType messageType) {
        return switch (messageType) {
            case USER -> "user";
            case ASSISTANT -> "assistant";
            default -> "system";
        };
    }

    private UUID parseConversationId(String conversationId) {
        try {
            return UUID.fromString(conversationId);
        } catch (IllegalArgumentException e) {
            return UUID.nameUUIDFromBytes(conversationId.getBytes());
        }
    }
}