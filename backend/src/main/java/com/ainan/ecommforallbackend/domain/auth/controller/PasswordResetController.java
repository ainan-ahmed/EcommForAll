package com.ainan.ecommforallbackend.domain.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.auth.dto.ForgotPasswordDto;
import com.ainan.ecommforallbackend.domain.auth.dto.PasswordResetResponseDto;
import com.ainan.ecommforallbackend.domain.auth.dto.ResetPasswordDto;
import com.ainan.ecommforallbackend.domain.auth.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Password Reset", description = "Password recovery and reset token workflows")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Generates a password reset token for the provided email.")
    public ResponseEntity<PasswordResetResponseDto> forgotPassword(@Valid @RequestBody ForgotPasswordDto request) {
        try {
            String token = passwordResetService.generateResetToken(request.getEmail());

            // TODO: Send email with reset link containing the token

            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Password reset token generated",
                    true,
                    token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Failed to generate password reset token",
                    false,
                    null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Resets the password using a valid reset token.")
    public ResponseEntity<PasswordResetResponseDto> resetPassword(@Valid @RequestBody ResetPasswordDto request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    "Password reset successfully",
                    true,
                    null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PasswordResetResponseDto response = new PasswordResetResponseDto(
                    e.getMessage(),
                    false,
                    null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate-reset-token")
    @Operation(summary = "Validate reset token", description = "Checks whether the password reset token is valid or expired.")
    public ResponseEntity<PasswordResetResponseDto> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        PasswordResetResponseDto response = new PasswordResetResponseDto(
                isValid ? "Token is valid" : "Token is invalid or expired",
                isValid,
                null);
        return ResponseEntity.ok(response);
    }
}
