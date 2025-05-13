package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.RoleUpdateDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.service.AdminService;
import com.ainan.ecommforallbackend.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final WishlistService wishlistService;

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

    @PutMapping("/users/{userId}/changeRole")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody RoleUpdateDto roleUpdateDto) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, roleUpdateDto.getRole()));
    }

    @PostMapping("/create-default-wishlists")
    public ResponseEntity<String> createDefaultWishlistsForAllUsers() {
        AtomicInteger count = new AtomicInteger(0);

        // Use pagination to get all users
        int page = 0;
        int size = 100;
        Page<UserDto> userPage;

        do {
            Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, "id");
            userPage = adminService.getAllUsers(pageable);

            userPage.getContent().forEach(user -> {
                boolean isCreated = wishlistService.createDefaultWishlistIfNotExists(user.getId().toString());
                if (isCreated) {
                    count.incrementAndGet();
                }
            });

            page++;
        } while (page < userPage.getTotalPages());

        return ResponseEntity.ok("Created default wishlists for " + count.get() + " users");
    }
}