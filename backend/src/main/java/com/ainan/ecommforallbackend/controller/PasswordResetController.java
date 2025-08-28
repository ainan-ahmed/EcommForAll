package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.ForgotPasswordDto;
import com.ainan.ecommforallbackend.dto.PasswordResetResponseDto;
import com.ainan.ecommforallbackend.dto.ResetPasswordDto;
import com.ainan.ecommforallbackend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponseDto> forgotPassword(@Valid @RequestBody ForgotPasswordDto request) {
        try {
            String token = passwordResetService.generateResetToken(request.getEmail());

            // TODO: Send email with reset link containing the token

            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Password reset token generated",
                    true,
                    token
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Failed to generate password reset token",
                    false,
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponseDto> resetPassword(@Valid @RequestBody ResetPasswordDto request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Password reset successfully",
                    true,
                    null
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    e.getMessage(),
                    false,
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<PasswordResetResponseDto> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        PasswordResetResponseDto response = new PasswordResetResponseDto(
                isValid ? "Token is valid" : "Token is invalid or expired",
                isValid,
                null
        );
        return ResponseEntity.ok(response);
    }
}