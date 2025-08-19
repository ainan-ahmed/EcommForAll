package com.ainan.ecommforallbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {
    private UUID sessionId;
    private String message;
    private String intent;
    private boolean requiresAction;
    private String actionType;
    private LocalDateTime timestamp;
    private boolean success;
    private String errorMessage;

    // Static factory methods for easy creation
    public static ChatResponseDto success(UUID sessionId, String message, String intent) {
        ChatResponseDto response = new ChatResponseDto();
        response.setSessionId(sessionId);
        response.setMessage(message);
        response.setIntent(intent);
        response.setTimestamp(LocalDateTime.now());
        response.setSuccess(true);
        response.setRequiresAction(false);
        return response;
    }

    public static ChatResponseDto error(UUID sessionId, String errorMessage) {
        ChatResponseDto response = new ChatResponseDto();
        response.setSessionId(sessionId);
        response.setMessage("I apologize, but I'm having trouble processing your request right now. Please try again later.");
        response.setIntent("ERROR");
        response.setTimestamp(LocalDateTime.now());
        response.setSuccess(false);
        response.setErrorMessage(errorMessage);
        response.setRequiresAction(false);
        return response;
    }

    // Convenience method to set action requirements
    public void setAction(String actionType) {
        this.requiresAction = true;
        this.actionType = actionType;
    }

    // Check if response has actions
    public boolean hasAction() {
        return requiresAction && actionType != null;
    }
}