package com.ainan.ecommforallbackend.dto;

import com.ainan.ecommforallbackend.entity.RoleName;
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