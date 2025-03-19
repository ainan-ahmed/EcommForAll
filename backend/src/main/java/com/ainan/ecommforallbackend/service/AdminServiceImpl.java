package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.entity.RoleName;
import com.ainan.ecommforallbackend.entity.User;
import com.ainan.ecommforallbackend.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.mapper.UserMapper;
import com.ainan.ecommforallbackend.repository.UserRepository;
import lombok.AllArgsConstructor;
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
    public UserDto updateUserRole(UUID userId, RoleName newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        return UserMapper.INSTANCE.UserToUserDto(updatedUser);
    }
    @Override
    public Page<UserDto> getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(UserMapper.INSTANCE::UserToUserDto);
    }
}