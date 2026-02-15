package com.ainan.ecommforallbackend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.admin.service.AdminService;
import com.ainan.ecommforallbackend.domain.ai.dto.EmbeddingSyncResponseDto;
import com.ainan.ecommforallbackend.domain.cart.service.ShoppingCartService;
import com.ainan.ecommforallbackend.domain.product.service.ProductEmbeddingService;
import com.ainan.ecommforallbackend.domain.user.dto.RoleUpdateDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.domain.wishlist.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin", description = "Administrative user management and maintenance tasks")
public class AdminController {

    private final AdminService adminService;
    private final WishlistService wishlistService;
    private final ShoppingCartService shoppingCartService;
    private final ProductEmbeddingService embeddingService;

    @GetMapping("/users")
    @Operation(summary = "List users", description = "Returns a paginated list of users with sorting options.")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, sortDirection, sort);
        Page<UserDto> users = adminService.getAllUsers(pageable);

        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/changeRole")
    @Operation(summary = "Update user role", description = "Changes the role for a user account.")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody RoleUpdateDto roleUpdateDto) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, roleUpdateDto.getRole()));
    }

    @PostMapping("/sync-embeddings")
    @Operation(summary = "Sync product embeddings", description = "Regenerates AI embeddings for all products.")
    public ResponseEntity<EmbeddingSyncResponseDto> syncEmbeddings() {
        EmbeddingSyncResponseDto response = embeddingService.syncAllProducts();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-default-wishlists-and-carts")
    @Operation(summary = "Create default wishlists and carts", description = "Creates a default wishlist and shopping cart for all users.")
    public ResponseEntity<String> createDefaultWishlistsAndCartsForAllUsers() {
        try {
            log.info("Starting creation of default wishlists and shopping carts for all users");

            AtomicInteger wishlistCount = new AtomicInteger(0);
            AtomicInteger cartCount = new AtomicInteger(0);

            int page = 0;
            int size = 100;
            Page<UserDto> userPage;

            do {
                Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, "id");
                userPage = adminService.getAllUsers(pageable);

                userPage.getContent().forEach(user -> {
                    try {
                        String userId = user.getId().toString();
                        log.debug("Processing user: {}", userId);

                        // Create default wishlist
                        try {
                            WishlistCreateDto defaultWishlist = new WishlistCreateDto();
                            defaultWishlist.setName("Favorites");
                            wishlistService.createWishlist(defaultWishlist, userId);
                            wishlistCount.incrementAndGet();
                            log.debug("Created wishlist for user: {}", userId);
                        } catch (Exception e) {
                            log.warn("Failed to create wishlist for user {}: {}", userId, e.getMessage());
                        }

                        // Create shopping cart
                        try {
                            shoppingCartService.createShoppingCartIfNotExists(userId);
                            cartCount.incrementAndGet();
                            log.debug("Processed shopping cart for user: {}", userId);
                        } catch (Exception e) {
                            log.warn("Failed to create shopping cart for user {}: {}", userId, e.getMessage());
                        }

                    } catch (Exception e) {
                        log.error("Failed to process user {}: {}", user.getId(), e.getMessage());
                    }
                });

                page++;
                log.info("Processed page {} of {}", page, userPage.getTotalPages());

            } while (page < userPage.getTotalPages());

            String message = String.format(
                    "Successfully processed %d users. Created %d wishlists and %d shopping carts",
                    userPage.getTotalElements(), wishlistCount.get(), cartCount.get());
            log.info(message);

            return ResponseEntity.ok(message);

        } catch (Exception e) {
            log.error("Error in createDefaultWishlistsAndCartsForAllUsers: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error creating defaults: " + e.getMessage());
        }
    }
}
