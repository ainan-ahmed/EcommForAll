package com.ainan.ecommforallbackend.domain.user.dto;

import com.ainan.ecommforallbackend.domain.user.entity.RoleName;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class RoleUpdateDto {
    private RoleName role;
}