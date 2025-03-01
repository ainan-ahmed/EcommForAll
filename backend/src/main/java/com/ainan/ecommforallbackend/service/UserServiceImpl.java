package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.entity.User;
import com.ainan.ecommforallbackend.mapper.UserMapper;
import com.ainan.ecommforallbackend.repository.UserRepository;
import com.ainan.ecommforallbackend.exception.ResourceNotFoundException;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;
//    @Override
//    public UserAuthDto createUser(UserAuthDto userAuthDto) {
//        User user = UserMapper.INSTANCE.UserAuthDtoToUser(userAuthDto);
//        User savedUser = userRepository.save(user);
//        return UserMapper.INSTANCE.UserToUserAuthDto(savedUser);
//    }

    @Override
    public UserDto getUser(UUID id)
    {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.INSTANCE.UserToUserDto(user);
    }

    @Override
    public UserAuthDto updateUser(UUID id, UserAuthDto userAuthDto) {

        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFirstName(userAuthDto.getFirstName());
        user.setLastName(userAuthDto.getLastName());
        user.setEmail(userAuthDto.getEmail());
        user.setUsername(userAuthDto.getUsername());
        User updatedUser = userRepository.save(user);
        return UserMapper.INSTANCE.UserToUserAuthDto(updatedUser);
    }

    @Override
    public void deleteUser(UUID id) {
        User deletedUser = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(deletedUser);
    }


    @Override
    public UserDto getUserByUsername(String username) {
       User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
         return UserMapper.INSTANCE.UserToUserDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.INSTANCE.UserToUserDto(user);
    }
}
