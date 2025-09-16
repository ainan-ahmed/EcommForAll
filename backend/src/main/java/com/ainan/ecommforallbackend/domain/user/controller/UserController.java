package com.ainan.ecommforallbackend.domain.user.controller;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.auth.dto.ChangePasswordDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.service.UserService;

import java.util.UUID;

//@RequiredArgsConstructor
@AllArgsConstructor()
@RestController
@RequestMapping("/api/user")
@PreAuthorize("isAuthenticated()")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUser(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<UserAuthDto> updateUser(@PathVariable UUID id, @RequestBody UserAuthDto userAuthDto) {
        UserAuthDto updatedUser = userService.updateUser(id, userAuthDto);
        return ResponseEntity.ok(updatedUser);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto request,
                                                 Authentication authentication) {
        String username = authentication.getName();
        userService.changePassword(username, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}

