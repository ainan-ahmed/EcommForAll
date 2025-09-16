package com.ainan.ecommforallbackend.domain.wishlist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.wishlist.entity.Wishlist;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    List<Wishlist> findAllByUserId(UUID user_id);

    Optional<Wishlist> findByIdAndUserId(UUID id, UUID user_id);

    boolean existsByIdAndUserIdAndProductsId(UUID id, UUID user_id, UUID products_id);
}