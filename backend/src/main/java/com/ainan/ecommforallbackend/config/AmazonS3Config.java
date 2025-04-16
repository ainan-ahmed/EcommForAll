package com.ainan.ecommforallbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AmazonS3Config {
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .build();
    }
}