package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.VariantImageCreateDto;
import com.ainan.ecommforallbackend.dto.VariantImageDto;
import com.ainan.ecommforallbackend.entity.ProductVariant;
import com.ainan.ecommforallbackend.entity.VariantImage;
import com.ainan.ecommforallbackend.mapper.VariantImageMapper;
import com.ainan.ecommforallbackend.repository.ProductVariantRepository;
import com.ainan.ecommforallbackend.repository.VariantImageRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.UUID;

@Data
@RequiredArgsConstructor
@Service
public class VariantImageServiceImpl implements VariantImageService {
    private final VariantImageRepository variantImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantImageMapper variantImageMapper;
    private final S3Service s3Service;

    @Override
    @Transactional(readOnly = true)
    public Page<VariantImageDto> getImagesByVariantId(UUID variantId, Pageable pageable) {
        ProductVariant productVariant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found with variantId: " + variantId));

        return variantImageRepository.findByVariantId(productVariant.getId(), pageable)
                .map(variantImage -> convertToPresignedUrl(variantImageMapper.variantImageToVariantImageDto(variantImage)));
    }

    @Override
    @Transactional(readOnly = true)
    public VariantImageDto getImageById(UUID id) {
        return convertToPresignedUrl(variantImageMapper.variantImageToVariantImageDto(
                variantImageRepository.findById(id).orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id))
        ));
    }

    @Override
    @Transactional
    public VariantImageDto createImage(VariantImageCreateDto createDto) {
        ProductVariant productVariant = productVariantRepository.findById(createDto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + createDto.getVariantId()));
        VariantImage variantImage = variantImageMapper.variantImageCreateDtoToVariantImage(createDto);
        variantImage.setVariant(productVariant);
        VariantImage savedImage = variantImageRepository.save(variantImage);
        return convertToPresignedUrl(variantImageMapper.variantImageToVariantImageDto(savedImage));
    }

    @Override
    @Transactional
    public VariantImageDto updateImage(UUID id, VariantImageDto imageDto) {
        ProductVariant productVariant = productVariantRepository.findById(imageDto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + imageDto.getVariantId()));
        VariantImage existingImage = variantImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id));
        variantImageMapper.variantImageDtoToVariantImage(imageDto, existingImage);
        existingImage.setVariant(productVariant);
        VariantImage updatedImage = variantImageRepository.save(existingImage);
        return convertToPresignedUrl(variantImageMapper.variantImageToVariantImageDto(updatedImage));
    }

    @Override
    @Transactional
    public void deleteImage(UUID id) {
        VariantImage existingImage = variantImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id));
        variantImageRepository.delete(existingImage);
    }

    private VariantImageDto convertToPresignedUrl(VariantImageDto imageDto) {
        if (imageDto != null && imageDto.getImageUrl() != null) {
            // Extract key from URL
            String imageUrl = imageDto.getImageUrl();
            URI uri = URI.create(imageUrl);
            String key = uri.getPath();
            if (key.startsWith("/")) {
                key = key.substring(1);
            }

            // Generate a pre-signed URL with 1-hour expiration
            String presignedUrl = s3Service.generatePresignedDownloadUrl(key, 60);
            imageDto.setImageUrl(presignedUrl);
        }
        return imageDto;
    }
}