package com.ainan.ecommforallbackend.listener;

import com.ainan.ecommforallbackend.entity.ProductVariant;
import com.ainan.ecommforallbackend.service.ProductVariantService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Data
public class VariantListener {
    private ProductVariantService variantService;

    @PostPersist
    @PostUpdate
    @PostRemove
    public void onPostPersistOrUpdateOrRemove(ProductVariant variant) {
        variantService.updateProductPrice(variant.getProduct().getId());
    }
}
