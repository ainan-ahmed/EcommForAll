package com.ainan.ecommforallbackend.domain.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDto {
    @NotBlank(message = "Message is required")
    @Size(min = 1, max = 255, message = "Message must be between 1 and 255 characters")
    private String message;

    private UUID conversationId;

    // Optional context for maintaining conversation state
    private String context;

    // Optional metadata for tracking
    private String userAgent;
    private String ipAddress;

    private LocalDateTime timestamp;
}
