package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.entity.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;


public interface AdminService {
    UserDto updateUserRole(UUID userId, RoleName newRole);
    Page<UserDto> getAllUsers(Pageable pageable);
    // Add other admin-specific operations here
}