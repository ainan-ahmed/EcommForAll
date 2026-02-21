package com.ainan.ecommforallbackend.domain.ai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;

@Data
public class ProductDescriptionRequestDto {
    @NotNull(message = "Product name is required")
    private String productName;
    private String category;
    private String brand;
    private String existingDescription;
    private Map<String, String> attributes;
    private String targetAudience;
    private Boolean hasVariants;
    private List<ProductVariantDto> variants;
    private String tone;
    private Integer maxLength;
    private String prompt;

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getExistingDescription() { return existingDescription; }
    public void setExistingDescription(String existingDescription) { this.existingDescription = existingDescription; }
    public Map<String, String> getAttributes() { return attributes; }
    public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public Boolean getHasVariants() { return hasVariants; }
    public void setHasVariants(Boolean hasVariants) { this.hasVariants = hasVariants; }
    public List<ProductVariantDto> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDto> variants) { this.variants = variants; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    public Integer getMaxLength() { return maxLength; }
    public void setMaxLength(Integer maxLength) { this.maxLength = maxLength; }
}