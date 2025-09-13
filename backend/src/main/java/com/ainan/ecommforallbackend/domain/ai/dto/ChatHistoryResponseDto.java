package com.ainan.ecommforallbackend.domain.ai.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class ChatHistoryResponseDto {
    private UUID conversationId;
    private List<ChatHistoryMessageDto> messages;
    private Instant retrievedAt = Instant.now();
    private int totalMessages;

    public void setMessages(List<ChatHistoryMessageDto> messages) {
        this.messages = messages;
        this.totalMessages = messages != null ? messages.size() : 0;
    }
}