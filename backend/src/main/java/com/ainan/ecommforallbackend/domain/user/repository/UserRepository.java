package com.ainan.ecommforallbackend.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ainan.ecommforallbackend.domain.user.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
