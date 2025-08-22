package com.ainan.ecommforallbackend.config;

import com.ainan.ecommforallbackend.service.ChatbotTools;
import com.ainan.ecommforallbackend.util.PromptTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ChatbotConfig {

    @Value("${chatbot.max-messages:20}")
    private int maxMessages;

    private final JdbcChatMemoryRepository chatMemoryRepository;
    private final ChatbotTools chatbotTools;
    private final VectorStore vectorStore;

    @Bean
    public ChatMemory chatMemory() {
        log.info("Creating ChatMemory with max messages: {}", maxMessages);
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(chatMemoryRepository)
                .maxMessages(maxMessages)
                .build();
    }

    @Bean("chatbotClient")
    public ChatClient chatbotClient(ChatModel chatModel, ChatMemory chatMemory) {
        log.info("Building ChatClient with full features for Vertex AI...");
        log.info("VectorStore available: {}", vectorStore != null ? "Yes" : "No");

        try {
            QuestionAnswerAdvisor qaAdvisor = QuestionAnswerAdvisor.builder(vectorStore).build();
            log.info("QuestionAnswerAdvisor created successfully");

            return ChatClient.builder(chatModel)
                    .defaultSystem(PromptTemplates.defaultChatBotPrompt)
                    .defaultAdvisors(
                            MessageChatMemoryAdvisor.builder(chatMemory).build(), // Memory advisor
                            qaAdvisor) // RAG advisor
                    .defaultTools(chatbotTools)
                    .build();
        } catch (Exception e) {
            log.error("Failed to create QuestionAnswerAdvisor: {}", e.getMessage(), e);
            log.warn("Falling back to ChatClient without QuestionAnswerAdvisor");

            return ChatClient.builder(chatModel)
                    .defaultSystem(PromptTemplates.defaultChatBotPrompt)
                    .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build()) // Memory advisor only
                    .defaultTools(chatbotTools)
                    .build();
        }
    }
}