package com.ainan.ecommforallbackend.domain.ai.agent.base;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Standard response object for all agents.
 * Provides a unified interface for agent responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {

    /**
     * Name of the agent that produced this response.
     */
    private String agentName;

    /**
     * Whether execution was successful.
     */
    private boolean success;

    /**
     * The primary response content.
     */
    private String content;

    /**
     * Error message if execution failed.
     */
    private String errorMessage;

    /**
     * Request ID this response corresponds to.
     */
    private UUID requestId;

    /**
     * Metadata/structured data from the response.
     */
    private Map<String, Object> metadata;

    /**
     * Timestamp of response generation.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Factory method for successful response.
     */
    public static AgentResponse success(String agentName, String content, UUID requestId) {
        return AgentResponse.builder()
                .agentName(agentName)
                .success(true)
                .content(content)
                .requestId(requestId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Factory method for error response.
     */
    public static AgentResponse error(String agentName, String errorMessage, UUID requestId) {
        return AgentResponse.builder()
                .agentName(agentName)
                .success(false)
                .errorMessage(errorMessage)
                .requestId(requestId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Factory method for successful response with metadata.
     */
    public static AgentResponse success(String agentName, String content, UUID requestId,
            Map<String, Object> metadata) {
        return AgentResponse.builder()
                .agentName(agentName)
                .success(true)
                .content(content)
                .requestId(requestId)
                .metadata(metadata)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public boolean isSuccess() { return success; }
    public String getAgentName() { return agentName; }
    public String getContent() { return content; }
}
