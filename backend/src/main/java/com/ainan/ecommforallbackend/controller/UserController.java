package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

//@RequiredArgsConstructor
@AllArgsConstructor()
@RestController
@RequestMapping("/api/users")
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
}

