// src/main/java/com/ainan/ecommforallbackend/service/S3Service.java
package com.ainan.ecommforallbackend.domain.product.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface S3Service {
    String uploadFile(MultipartFile file) throws IOException;
    String uploadFile(MultipartFile file, String folder) throws IOException;
    void deleteFile(String fileName);
    String getFileUrl(String fileName);
    String generatePresignedDownloadUrl(String key, long expirationInMinutes);
}