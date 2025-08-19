package com.ainan.ecommforallbackend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Initialize vector database first
        initializeVectorDatabase();
        
        // Check if data already exists to prevent duplicate inserts
        try {
            Long categoryCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM category", Long.class);
            if (categoryCount != null && categoryCount > 0) {
                return; // Database already has data, don't insert again
            }
        } catch (Exception e) {
            // Table might not exist yet, continue with initialization
        }

        // Read SQL file content
        ClassPathResource resource = new ClassPathResource("populate-data.sql");
        byte[] byteData = FileCopyUtils.copyToByteArray(resource.getInputStream());
        String sql = new String(byteData, StandardCharsets.UTF_8);

        // Split and execute SQL statements
        String[] statements = sql.split(";");
        for (String statement : statements) {
            if (!statement.trim().isEmpty()) {
                jdbcTemplate.execute(statement);
            }
        }
    }
    
    private void initializeVectorDatabase() {
        try {
            log.info("Initializing vector database...");
            
            // Read vector initialization SQL file
            ClassPathResource resource = new ClassPathResource("init-vector-db.sql");
            byte[] byteData = FileCopyUtils.copyToByteArray(resource.getInputStream());
            String sql = new String(byteData, StandardCharsets.UTF_8);

            // Split and execute SQL statements
            String[] statements = sql.split(";");
            for (String statement : statements) {
                if (!statement.trim().isEmpty()) {
                    jdbcTemplate.execute(statement);
                }
            }
            
            log.info("Vector database initialization completed successfully");
        } catch (Exception e) {
            log.error("Failed to initialize vector database: {}", e.getMessage(), e);
            // Don't throw exception here as it might prevent the application from starting
        }
    }
}