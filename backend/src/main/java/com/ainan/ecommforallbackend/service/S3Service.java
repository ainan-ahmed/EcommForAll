// src/main/java/com/ainan/ecommforallbackend/service/S3Service.java
package com.ainan.ecommforallbackend.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface S3Service {
    String uploadFile(MultipartFile file) throws IOException;
    void deleteFile(String fileName);
    String getFileUrl(String fileName);
    String generatePresignedDownloadUrl(String key, long expirationInMinutes);
}