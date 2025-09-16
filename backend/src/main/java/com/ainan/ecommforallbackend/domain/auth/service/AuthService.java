package com.ainan.ecommforallbackend.domain.auth.service;

import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.entity.RoleName;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.mapper.UserMapper;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Getter
@Setter
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public UserDto register(UserAuthDto registrationDto) {
        if (userRepository.findByUsername(registrationDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(registrationDto.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists");
        }
        User user = UserMapper.INSTANCE.UserAuthDtoToUser(registrationDto);
        if (user.getRole() == null) {
            user.setRole(RoleName.USER);
        }
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword())); // Encode password
        User savedUser = userRepository.save(user);
        return UserMapper.INSTANCE.UserToUserDto(savedUser);
    }

    public UserDto login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.INSTANCE.UserToUserDto(user);
    }
}