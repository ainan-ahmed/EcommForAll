package com.ainan.ecommforallbackend.domain.ai.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ChatHistoryMessageDto {
    private String sender; // "user", "assistant", or "system"
    private String content;
    private Instant timestamp;
}