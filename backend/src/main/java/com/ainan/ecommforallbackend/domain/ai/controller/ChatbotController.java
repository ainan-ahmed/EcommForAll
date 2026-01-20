package com.ainan.ecommforallbackend.domain.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.ai.dto.ChatHistoryMessageDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatHistoryResponseDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatRequestDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatResponseDto;
import com.ainan.ecommforallbackend.domain.ai.service.ChatbotService;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.service.UserService;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chatbot", description = "AI-powered customer service chatbot with persistent memory")
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final ChatMemory chatMemory;
    private final UserService userService;

    @PostMapping("/chat")
    @Operation(summary = "Send message to chatbot", description = "Send a message and get AI-powered response with conversation memory")
    public ResponseEntity<ChatResponseDto> chat(
            @Valid @RequestBody ChatRequestDto request,
            Principal principal) {

        try {
            // Set user information from principal if authenticated
            if (principal != null) {
                UUID userId = getUserIdFromPrincipal(principal);
                request.setConversationId(userId);

                // Generate session ID if not provided
                if (request.getConversationId() == null) {
                    request.setConversationId(generateSessionId(userId));
                }
            } else if (request.getConversationId() == null) {
                // Generate anonymous session ID
                request.setConversationId(UUID.randomUUID());
            }

            // Add timestamp to request
            if (request.getTimestamp() == null) {
                request.setTimestamp(LocalDateTime.now());
            }

            log.info("Processing chat request for session: {} at {}",
                    request.getConversationId(), request.getTimestamp());

            ChatResponseDto response = chatbotService.processMessage(request);

            // Ensure response has proper timestamp
            if (response.getTimestamp() == null) {
                response.setTimestamp(LocalDateTime.now());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing chat request: {}", e.getMessage(), e);

            ChatResponseDto errorResponse = ChatResponseDto.success(
                    request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID(),
                    "I apologize, but I'm having trouble processing your request right now. Please try again later.",
                    "ERROR"
            );
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/chat")
    @Operation(summary = "Get chat history")
    public ResponseEntity<ChatHistoryResponseDto> getConversation(
            @RequestParam(required = false) UUID conversationId,
            Principal principal) {
        try {
            if (principal != null) {
                UserDto authenticatedUser = userService.getUserByUsername(principal.getName());
                conversationId = conversationId != null ? conversationId : authenticatedUser.getId();
            } else {
                return ResponseEntity.badRequest().build();
            }

            List<Message> history = chatMemory.get(conversationId.toString());

            if (history.isEmpty()) {
                // Return empty history instead of 404
                ChatHistoryResponseDto emptyResponse = new ChatHistoryResponseDto();
                emptyResponse.setConversationId(conversationId);
                emptyResponse.setMessages(new ArrayList<>());
                return ResponseEntity.ok(emptyResponse);
            }

            ChatHistoryResponseDto response = convertToChatHistoryWithMetadata(conversationId.toString(), history);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving conversation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private ChatHistoryResponseDto convertToChatHistoryWithMetadata(String conversationId, List<Message> messages) {
        ChatHistoryResponseDto response = new ChatHistoryResponseDto();
        response.setConversationId(parseConversationId(conversationId));
        response.setMessages(new ArrayList<>());

        // Use current time as base for timestamp calculation
        Instant baseTime = Instant.now().minusSeconds(messages.size() * 60); // 1 minute intervals

        for (int i = 0; i < messages.size(); i++) {
            Message message = messages.get(i);

            // Skip system messages to avoid showing internal prompts
            if (message.getMessageType() == MessageType.SYSTEM) {
                continue;
            }

            ChatHistoryMessageDto historyMessage = new ChatHistoryMessageDto();

            String content = cleanMessageContent(message);
            historyMessage.setContent(content);

            // Try to get timestamp from message metadata, fallback to estimated time
            Instant messageTime = getMessageTimestamp(message, baseTime.plusSeconds(i * 60));
            historyMessage.setTimestamp(messageTime);

            // Set sender based on message type
            historyMessage.setSender(mapMessageTypeToSender(message.getMessageType()));

            response.getMessages().add(historyMessage);
        }

        return response;
    }

    private String cleanMessageContent(Message message) {
        String content = message.getText();

        // Clean up user messages that contain system prompt formatting
        if (message.getMessageType() == MessageType.USER && content.contains("Customer Intent:")) {
            // Extract only the actual user message
            if (content.contains("Customer Message: ")) {
                content = content.substring(content.lastIndexOf("Customer Message: ") + 18).trim();
            }
        }

        return content;
    }

    private Instant getMessageTimestamp(Message message, Instant fallbackTime) {
        // Try to extract timestamp from message metadata if available
        if (message.getMetadata() != null && message.getMetadata().containsKey("timestamp")) {
            try {
                Object timestamp = message.getMetadata().get("timestamp");
                if (timestamp instanceof LocalDateTime) {
                    // Convert LocalDateTime to Instant using system default time zone
                    return ((LocalDateTime) timestamp).atZone(ZoneId.systemDefault()).toInstant();
                } else if (timestamp instanceof String) {
                    // Parse string as LocalDateTime, then convert to Instant
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
            // If conversationId is not a valid UUID, generate one based on the string
            return UUID.nameUUIDFromBytes(conversationId.getBytes());
        }
    }

    private UUID generateSessionId(UUID userId) {
        // Generate a session-specific ID that includes user context
        return userId != null ? userId : UUID.randomUUID();
    }

    @DeleteMapping("/chat/{conversationId}")
    @Operation(summary = "Clear conversation", description = "Clear conversation history for a specific conversation ID")
    public ResponseEntity<Void> clearConversation(@PathVariable String conversationId) {
        try {
            chatMemory.clear(conversationId);
            log.info("Cleared conversation: {}", conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error clearing conversation {}: {}", conversationId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Check chatbot health", description = "Check if the chatbot service is operational")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service with persistent memory is operational");
    }

    private UUID getUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            return null;
        }
        UserDto user = userService.getUserByUsername(principal.getName());
        return user.getId();
    }
}