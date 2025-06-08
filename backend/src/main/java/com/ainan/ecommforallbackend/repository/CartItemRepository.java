package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartIdAndProductId(UUID cartId, UUID productId);

    void deleteAllByCartId(UUID cartId);
}