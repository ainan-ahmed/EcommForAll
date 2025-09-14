package com.ainan.ecommforallbackend.domain.auth.service;

import com.ainan.ecommforallbackend.domain.auth.entity.PasswordResetToken;
import com.ainan.ecommforallbackend.domain.auth.repository.PasswordResetTokenRepository;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public String generateResetToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = userOptional.get();

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        // Generate secure random token
        String token = generateSecureToken();

        // Create new reset token (expires in 30 minutes)
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        passwordResetTokenRepository.save(resetToken);

        return token;
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOptional =
                passwordResetTokenRepository.findByTokenAndUsedFalse(token);

        if (resetTokenOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        PasswordResetToken resetToken = resetTokenOptional.get();

        if (!resetToken.isValid()) {
            throw new RuntimeException("Reset token has expired or been used");
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> resetTokenOptional =
                passwordResetTokenRepository.findByTokenAndUsedFalse(token);

        return resetTokenOptional.isPresent() && resetTokenOptional.get().isValid();
    }

    private String generateSecureToken() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}