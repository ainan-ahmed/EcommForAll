package com.ainan.ecommforallbackend.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordDto {
    @NotBlank(message = "Token cannot be blank")
    private String token;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
}
