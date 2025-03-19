package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.entity.User;
import com.ainan.ecommforallbackend.mapper.UserMapper;
import com.ainan.ecommforallbackend.repository.UserRepository;
import com.ainan.ecommforallbackend.exception.ResourceNotFoundException;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
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
    @Transactional
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
    @Transactional
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

    @Override
    @Transactional
    public void changePassword(String username, String oldPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found.");
        }

        User user = optionalUser.get();

        // Correct logic: if old password doesn't match, throw error; otherwise update
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
