package com.ainan.ecommforallbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    @Value("${aws.s3.bucket}")
    private String bucketName;


    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            return getFileUrl(fileName);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to upload file. Please retry.", e);
        }

    }
    @Override
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            return getFileUrl(fileName);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to upload file to folder. Please retry.", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
       try {
           URI uri = URI.create(fileUrl);
           String key = uri.getPath();
           if (key.startsWith("/")) {
               key = key.substring(1);
           }
           DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                   .bucket(bucketName)
                   .key(key)
                   .build();

           s3Client.deleteObject(deleteObjectRequest);
       } catch (Exception e) {
           throw new RuntimeException("Failed to delete file: " + fileUrl, e);
       }
    }


    @Override
    public String getFileUrl(String fileName) {
        return s3Client.utilities().getUrl(builder -> builder
                        .bucket(bucketName)
                        .key(fileName)
                        .build())
                .toString();
    }

    @Override
    public String generatePresignedDownloadUrl(String key, long expirationInMinutes) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(expirationInMinutes))
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();

    }


}
