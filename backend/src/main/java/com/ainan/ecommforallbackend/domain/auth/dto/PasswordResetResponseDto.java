package com.ainan.ecommforallbackend.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetResponseDto {
    private String message;
    private boolean success;
    private String token; // Only for development, remove in production
}
