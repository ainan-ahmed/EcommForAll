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

import java.util.UUID;
@Data
@RequiredArgsConstructor
@Service
public class VariantImageServiceImpl implements VariantImageService {
    private final VariantImageRepository variantImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantImageMapper variantImageMapper;

    @Override
    public Page<VariantImageDto> getImagesByVariantId(UUID variantId, Pageable pageable) {
        ProductVariant productVariant = productVariantRepository.findById(variantId).orElseThrow(() -> new RuntimeException("Product variant not found with variantId: " + variantId));
        return variantImageRepository.findByVariantId(productVariant.getId(), pageable).map(variantImageMapper::variantImageToVariantImageDto);
    }

    @Override
    public VariantImageDto getImageById(UUID id) {
        return variantImageMapper.variantImageToVariantImageDto(
                variantImageRepository.findById(id).orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id))
        );
    }

    @Override
    public VariantImageDto createImage(VariantImageCreateDto createDto) {
        ProductVariant productVariant = productVariantRepository.findById(createDto.getVariantId()).orElseThrow(() -> new RuntimeException("Product variant not found with id: " + createDto.getVariantId()));
        VariantImage variantImage = variantImageMapper.variantImageCreateDtoToVariantImage(createDto);
        variantImage.setVariant(productVariant);
        VariantImage savedImage = variantImageRepository.save(variantImage);
        return variantImageMapper.variantImageToVariantImageDto(savedImage);
    }

    @Override
    public VariantImageDto updateImage(UUID id, VariantImageDto imageDto) {
        ProductVariant productVariant = productVariantRepository.findById(imageDto.getVariantId()).orElseThrow(() -> new RuntimeException("Product variant not found with id: " + imageDto.getVariantId()));
        VariantImage existingImage = variantImageRepository.findById(id).orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id));
        variantImageMapper.variantImageDtoToVariantImage(imageDto, existingImage);
        existingImage.setVariant(productVariant);
        VariantImage updatedImage = variantImageRepository.save(existingImage);
        return variantImageMapper.variantImageToVariantImageDto(updatedImage);
    }

    @Override
    public void deleteImage(UUID id) {
        VariantImage existingImage = variantImageRepository.findById(id).orElseThrow(() -> new RuntimeException("Variant image not found with id: " + id));
        variantImageRepository.delete(existingImage);
    }
}
