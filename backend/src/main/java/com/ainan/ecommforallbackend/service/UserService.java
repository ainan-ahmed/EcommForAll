package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
//    UserAuthDto createUser(UserAuthDto userAuthDto);
    UserDto getUser(UUID id);
    UserAuthDto updateUser(UUID id, UserAuthDto userAuthDtoDto);
    void deleteUser(UUID id);
    UserDto getUserByUsername(String username);
    UserDto getUserByEmail(String email);
    void changePassword(String username, String oldPassword, String newPassword);
//    List<UserDto> getAllUsers();
}
