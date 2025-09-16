package com.ainan.ecommforallbackend.domain.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.cart.entity.ShoppingCart;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, UUID> {
    Optional<ShoppingCart> findByUserId(UUID userId);
    
}
