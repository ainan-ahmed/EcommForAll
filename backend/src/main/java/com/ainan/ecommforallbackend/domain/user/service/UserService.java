package com.ainan.ecommforallbackend.domain.user.service;
import java.util.UUID;
import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;

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
