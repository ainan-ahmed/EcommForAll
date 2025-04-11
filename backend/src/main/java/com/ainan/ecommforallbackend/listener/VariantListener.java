package com.ainan.ecommforallbackend.listener;

import com.ainan.ecommforallbackend.entity.ProductVariant;
import com.ainan.ecommforallbackend.service.ProductVariantService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
public class VariantListener {

    private static ApplicationContext applicationContext;

    @Autowired
    public void setApplicationContext(ApplicationContext applicationContext) {
        VariantListener.applicationContext = applicationContext;
    }

    @PostPersist
    @PostUpdate
    @PostRemove
    public void onPostPersistOrUpdateOrRemove(ProductVariant variant) {
        // Only update price after transaction completes to avoid recursion
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    getVariantService().updateProductPrice(variant.getProduct().getId());
                }
            });
        }
    }

    private static ProductVariantService getVariantService() {
        return applicationContext.getBean(ProductVariantService.class);
    }
}