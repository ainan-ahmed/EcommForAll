package com.ainan.ecommforallbackend.config;

import com.ainan.ecommforallbackend.service.ChatbotTools;
import com.ainan.ecommforallbackend.util.PromptTemplates;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ChatbotConfig {

    @Value("${chatbot.max-messages:20}")
    private int maxMessages;

    private final JdbcChatMemoryRepository chatMemoryRepository;
    private final ChatbotTools chatbotTools;


    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(chatMemoryRepository)
                .maxMessages(maxMessages)
                .build();
    }

    @Bean("chatbotClient")
    public ChatClient chatbotClient(ChatModel chatModel, ChatMemory chatMemory) {
        return ChatClient.builder(chatModel)
                .defaultSystem(PromptTemplates.defaultChatBotPrompt)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .defaultTools(chatbotTools)
                .build();
    }
}