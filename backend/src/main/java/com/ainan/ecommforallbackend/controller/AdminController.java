package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.RoleUpdateDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, sortDirection, sort);
        Page<UserDto> users = adminService.getAllUsers(pageable);

        return ResponseEntity.ok(users);
    }
//    @GetMapping("/users/all")
//    public ResponseEntity<List<UserDto>> getAllUsers() {
//        List<UserDto> users = adminService.getAllUsers();
//        return ResponseEntity.ok(users);
//    }
    @PutMapping("/users/{userId}/changeRole")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody RoleUpdateDto roleUpdateDto) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, roleUpdateDto.getRole()));
    }
}