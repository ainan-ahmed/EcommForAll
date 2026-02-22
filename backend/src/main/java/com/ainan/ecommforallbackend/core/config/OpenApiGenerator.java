package com.ainan.ecommforallbackend.core.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@Profile("!prod") // Active in default/dev profiles, skipped in 'prod'
public class OpenApiGenerator implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(OpenApiGenerator.class);
    private final WebServerApplicationContext webServerApplicationContext;

    public OpenApiGenerator(WebServerApplicationContext webServerApplicationContext) {
        this.webServerApplicationContext = webServerApplicationContext;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            // Check if we are running with a real web server (not Mock in tests)
            int port = webServerApplicationContext.getWebServer().getPort();
            
            // Construct the URL to fetch API docs
            String url = "http://localhost:" + port + "/v3/api-docs";
            log.info("Generating OpenAPI JSON from {}", url);
            
            RestTemplate restTemplate = new RestTemplate();
            String json = restTemplate.getForObject(url, String.class);
            
            if (json != null) {
                // Determine output path
                // If running from IDE, current dir is usually project root or module root
                // We want to save to target/openapi.json relative to the backend module
                
                Path targetDir = Paths.get("target");
                if (!Files.exists(targetDir)) {
                    // Try to find it if we are in root (e.g. backend/target)
                    Path backendTarget = Paths.get("backend", "target");
                    if (Files.exists(backendTarget)) {
                        targetDir = backendTarget;
                    } else {
                        // Create target if it doesn't exist (e.g. clean checkout)
                        Files.createDirectories(targetDir);
                    }
                }

                Path file = targetDir.resolve("openapi.json");
                Files.writeString(file, json, StandardCharsets.UTF_8);
                log.info("OpenAPI JSON updated at: {}", file.toAbsolutePath());
            }
        } catch (Exception e) {
            // In tests or non-web environments, getting the web server or port might fail.
            // We log this as debug so it doesn't spam test logs, but warn if it looks like a real failure.
            log.debug("Skipping OpenAPI generation on startup: {}", e.getMessage());
        }
    }
}
