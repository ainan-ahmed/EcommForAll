package com.ainan.ecommforallbackend.domain.auth.repository;

import com.ainan.ecommforallbackend.domain.auth.entity.PasswordResetToken;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}