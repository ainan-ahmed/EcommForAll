package com.ainan.ecommforallbackend.domain.ai.agent.base;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

/**
 * Standard request object for all agents.
 * Provides a unified interface for agent invocation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentRequest {

    /**
     * Unique ID for this request (for tracing).
     */
    private UUID requestId;

    /**
     * Type of request (e.g., "GENERATE_DESCRIPTION", "SEARCH_PRODUCTS").
     */
    private String requestType;

    /**
     * Primary input data.
     */
    private Map<String, Object> input;

    /**
     * Additional parameters for agent customization.
     */
    private Map<String, Object> additionalParams;

    /**
     * Request context/metadata.
     */
    private Map<String, Object> context;

    /**
     * Static factory for creating request builders.
     */
    public static AgentRequestBuilder builder() {
        return new AgentRequestBuilder()
                .requestId(UUID.randomUUID());
    }

    /**
     * Get input value by key.
     */
    public Object getInputValue(String key) {
        return input != null ? input.get(key) : null;
    }

    /**
     * Get additional parameter by key.
     */
    public Object getAdditionalParam(String key) {
        return additionalParams != null ? additionalParams.get(key) : null;
    }

    /**
     * Get context value by key.
     */
    public Object getContextValue(String key) {
        return context != null ? context.get(key) : null;
    }
}
