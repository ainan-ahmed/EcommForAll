package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartIdAndVariantId(UUID cartId, UUID productId);

    void deleteAllByCartId(UUID cartId);

    // Existing method for items with variants
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(UUID cartId, UUID productId, UUID variantId);

    Optional<CartItem> findByCartIdAndProductIdAndVariantIsNull(UUID cartId, UUID productId);

    List<CartItem> findByCartId(UUID cartId);

}