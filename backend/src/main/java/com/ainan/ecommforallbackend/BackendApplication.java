package com.ainan.ecommforallbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.ainan.ecommforallbackend.repository")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);

        // Debug: Check if current AI configuration is loaded
        System.out.println("=== AI Configuration Debug ===");
        System.out.println("OpenAI API Key present: " + (System.getProperty("spring.ai.openai.api-key") != null ||
                System.getenv("OPENAI_API_KEY") != null ? "Yes" : "No"));
        System.out.println("OpenAI Base URL: " + System.getProperty("spring.ai.openai.base-url"));
        System.out.println("Chat Model: " + System.getProperty("spring.ai.openai.chat.options.model"));
        System.out.println("Embedding Model: " + System.getProperty("spring.ai.openai.embedding.options.model"));
        System.out.println("Database URL: " + System.getProperty("spring.datasource.url"));
        System.out.println("==============================");
    }
}
