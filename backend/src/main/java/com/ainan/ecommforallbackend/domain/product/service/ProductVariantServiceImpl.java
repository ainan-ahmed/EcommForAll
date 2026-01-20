package com.ainan.ecommforallbackend.domain.product.service;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.entity.ProductVariant;
import com.ainan.ecommforallbackend.domain.product.mapper.ProductVariantMapper;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductVariantRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper productVariantMapper;

    @Override
    public Page<ProductVariantDto> getVariantsByProductId(UUID productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return productVariantRepository.findByProductId(product.getId(), pageable)
                .map(productVariantMapper::productVariantToProductVariantDto);
    }

    @Override
    public ProductVariantDto getVariantById(UUID id) {
        return productVariantMapper.productVariantToProductVariantDto(
                productVariantRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id)));
    }

    @Override
    public ProductVariantDto getVariantBySku(String sku) {
        return productVariantMapper.productVariantToProductVariantDto(productVariantRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product variant not found with sku: " + sku)));
    }

    @Override
    @Transactional
    public ProductVariantDto createVariant(ProductVariantCreateDto productVariantCreateDto) {
        Product product = productRepository.findById(productVariantCreateDto.getProductId()).orElseThrow(
                () -> new RuntimeException("Product not found with id: " + productVariantCreateDto.getProductId()));
        ProductVariant productVariant = productVariantMapper
                .productVariantCreateDtoToProductVariant(productVariantCreateDto);
        productVariant.setProduct(product);
        productVariant.setSku(generateVariantSku(productVariant));
        ProductVariant savedVariant = productVariantRepository.save(productVariant);
        return productVariantMapper.productVariantToProductVariantDto(savedVariant);
    }

    @Override
    @Transactional
    public ProductVariantDto updateVariant(UUID id, ProductVariantDto variantDto) {
        ProductVariant existingVariant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        Product product = productRepository.findById(variantDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + variantDto.getProductId()));
        productVariantMapper.productVariantDtoToProductVariant(variantDto, existingVariant);
        existingVariant.setProduct(product);
        existingVariant.setSku(generateVariantSku(existingVariant));
        ProductVariant updatedVariant = productVariantRepository.save(existingVariant);
        return productVariantMapper.productVariantToProductVariantDto(updatedVariant);
    }

    @Override
    public void deleteVariant(UUID id) {
        ProductVariant existingVariant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        productVariantRepository.delete(existingVariant);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateProductPrice(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Only update minPrice if product has variants
        Optional<BigDecimal> minPriceOpt = productVariantRepository.findMinPriceByProductId(productId);
        if (minPriceOpt.isPresent()) {
            product.setMinPrice(minPriceOpt.get());
        } else {
            // No variants exist, clear minPrice (product will use its own price)
            product.setMinPrice(null);
        }

        productRepository.save(product);
        productRepository.flush();
    }

    // Format: {ProductPrefix}-{AttributePrefix}-{RandomNumber}
    private String generateVariantSku(ProductVariant productVariant) {
        String productPrefix = productVariant.getProduct().getName()
                .substring(0, Math.min(3, productVariant.getProduct().getName().length()))
                .toUpperCase();

        String attributePrefix = productVariant.getAttributeValues().toString()
                .substring(0, Math.min(3, productVariant.getAttributeValues().toString().length()))
                .toUpperCase();

        String randomPart = String.format("%04d", (int) (Math.random() * 10000));

        return String.format("%s-%s-%s", productPrefix, attributePrefix, randomPart);
    }
}
