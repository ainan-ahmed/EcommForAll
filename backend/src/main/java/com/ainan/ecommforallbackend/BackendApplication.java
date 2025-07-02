package com.ainan.ecommforallbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication()
@EnableJpaRepositories(basePackages = "com.ainan.ecommforallbackend.repository")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        // Debug: Check if env vars are loaded
        System.out.println("=== Environment Variables Debug ===");
        System.out.println("GOOGLE_CLOUD_PROJECT_ID: " + System.getenv("GOOGLE_CLOUD_PROJECT_ID"));
        System.out.println("GOOGLE_APPLICATION_CREDENTIALS: " + System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
        System.out.println("GOOGLE_CLOUD_LOCATION: " + System.getenv("GOOGLE_CLOUD_LOCATION"));
        System.out.println("===================================");

    }

}
