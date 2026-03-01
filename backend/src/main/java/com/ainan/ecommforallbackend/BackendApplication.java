package com.ainan.ecommforallbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import tech.ailef.snapadmin.external.SnapAdminAutoConfiguration;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.ainan.ecommforallbackend.domain.*.repository")
@ImportAutoConfiguration(SnapAdminAutoConfiguration.class)
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);

        // Debug: Check if current AI configuration is loaded
        System.out.println("=== AI Configuration Debug ===");
        System.out.println("Ollama Base URL: " + System.getProperty("spring.ai.ollama.base-url"));
        System.out.println("Chat Model: " + System.getProperty("spring.ai.ollama.chat.options.model"));
        System.out.println("Embedding Model: " + System.getProperty("spring.ai.ollama.embedding.options.model"));
        System.out.println("Database URL: " + System.getProperty("spring.datasource.url"));
        System.out.println("==============================");
    }
}
