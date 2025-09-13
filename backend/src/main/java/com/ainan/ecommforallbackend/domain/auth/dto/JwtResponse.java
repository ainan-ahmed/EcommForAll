package com.ainan.ecommforallbackend.domain.auth.dto;

import com.ainan.ecommforallbackend.domain.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private UserDto user;
}
