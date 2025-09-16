package com.ainan.ecommforallbackend.domain.admin.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.entity.RoleName;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.mapper.UserMapper;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;

import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    @CacheEvict(value = "users", key = "'allUsers' + #pageable")
    public UserDto updateUserRole(UUID userId, RoleName newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        return UserMapper.INSTANCE.UserToUserDto(updatedUser);
    }
    @Override
    @Cacheable(value = "users", key = "'allUsers' + #pageable")
    public Page<UserDto> getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(UserMapper.INSTANCE::UserToUserDto);
    }
}