package com.ainan.ecommforallbackend.domain.ai.agent.base;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;

import java.util.Map;

/**
 * Base class for all AI agents.
 * Defines common structure, execution flow, and configuration for agents.
 */
@Slf4j
@RequiredArgsConstructor
public abstract class BaseAgent {

    protected final ChatClient chatClient;

    /**
     * Execute the agent with the given request.
     * Implements the standard agent execution pattern.
     */
    public AgentResponse execute(AgentRequest request) {
        try {
            log.info("Executing agent: {} with request: {}", getAgentName(), request.getRequestType());

            // Validate input
            validateRequest(request);

            // Setup agent-specific configuration
            setupAgent(request);

            // Build system prompt
            String systemPrompt = buildSystemPrompt();

            // Build user prompt/query
            String userPrompt = buildUserPrompt(request);

            // Execute the AI call
            String aiResponse = callAI(systemPrompt, userPrompt, request.getAdditionalParams());

            // Post-process the response
            String processedResponse = postProcessResponse(aiResponse, request);

            log.info("Agent {} execution successful", getAgentName());
            return AgentResponse.success(getAgentName(), processedResponse, request.getRequestId());

        } catch (IllegalArgumentException e) {
            log.error("Invalid request for agent {}: {}", getAgentName(), e.getMessage());
            return AgentResponse.error(getAgentName(), "Invalid request: " + e.getMessage(), request.getRequestId());
        } catch (Exception e) {
            log.error("Error executing agent {}: {}", getAgentName(), e.getMessage(), e);
            return AgentResponse.error(getAgentName(), "Agent execution failed: " + e.getMessage(),
                    request.getRequestId());
        }
    }

    /**
     * Get the name of this agent.
     */
    protected abstract String getAgentName();

    /**
     * Validate the incoming request.
     * Throw IllegalArgumentException if invalid.
     */
    protected abstract void validateRequest(AgentRequest request);

    /**
     * Setup agent-specific configuration.
     * Override if needed.
     */
    protected void setupAgent(AgentRequest request) {
        // Default: no-op
    }

    /**
     * Build the system prompt that defines the agent's behavior.
     */
    protected abstract String buildSystemPrompt();

    /**
     * Build the user prompt/query for the AI.
     */
    protected abstract String buildUserPrompt(AgentRequest request);

    /**
     * Post-process the AI response.
     * Override if needed.
     */
    protected String postProcessResponse(String aiResponse, AgentRequest request) {
        return aiResponse;
    }

    /**
     * Call the underlying AI model.
     */
    protected String callAI(String systemPrompt, String userPrompt, Map<String, Object> params) {
        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userSpec -> {
                        if (params != null && !params.isEmpty()) {
                            userSpec.text(userPrompt).params(params);
                        } else {
                            userSpec.text(userPrompt);
                        }
                    })
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error calling AI: {}", e.getMessage(), e);
            throw new RuntimeException("AI call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Health check for the agent.
     */
    public boolean isHealthy() {
        try {
            chatClient.prompt()
                    .user("test")
                    .call()
                    .content();
            return true;
        } catch (Exception e) {
            log.error("Agent {} health check failed: {}", getAgentName(), e.getMessage());
            return false;
        }
    }
}
