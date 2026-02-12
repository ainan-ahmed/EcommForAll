package com.ainan.ecommforallbackend.domain.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.ai.dto.ChatHistoryResponseDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatRequestDto;
import com.ainan.ecommforallbackend.domain.ai.dto.ChatResponseDto;
import com.ainan.ecommforallbackend.domain.ai.service.ChatbotService;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.service.UserService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chatbot", description = "AI-powered customer service chatbot with persistent memory")
public class ChatbotController {

    private final ChatbotService chatbotService;
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

            ChatHistoryResponseDto response = chatbotService.getConversation(conversationId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving conversation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
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
            chatbotService.clearConversation(conversationId);
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