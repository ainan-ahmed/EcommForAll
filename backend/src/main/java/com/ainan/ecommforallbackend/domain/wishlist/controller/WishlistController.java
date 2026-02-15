package com.ainan.ecommforallbackend.domain.wishlist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.user.service.UserService;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistAddProductDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistDto;
import com.ainan.ecommforallbackend.domain.wishlist.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
@Tag(name = "Wishlists", description = "User wishlists and saved products")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "List user wishlists", description = "Returns all wishlists for the authenticated user.")
    public ResponseEntity<List<WishlistDto>> getUserWishlists(Principal principal) {
        String userId = getCurrentUserId(principal);
        System.out.println("User wishlist: " + userId);
        return ResponseEntity.ok(wishlistService.getUserWishlists(userId));
    }

    @GetMapping("/{wishlistId}")
    @Operation(summary = "Get wishlist", description = "Returns a wishlist by ID for the current user.")
    public ResponseEntity<WishlistDto> getWishlistById(@PathVariable String wishlistId, Principal principal) {
        String userId = getCurrentUserId(principal);
        return ResponseEntity.ok(wishlistService.getWishlistById(wishlistId, userId));
    }

    @PostMapping
    @Operation(summary = "Create wishlist", description = "Creates a new wishlist for the current user.")
    public ResponseEntity<WishlistDto> createWishlist(@Valid @RequestBody WishlistCreateDto wishlistCreateDto, Principal principal) {
        String userId = getCurrentUserId(principal);
        WishlistDto savedWishlist = wishlistService.createWishlist(wishlistCreateDto, userId);
        return new ResponseEntity<>(savedWishlist, HttpStatus.CREATED);
    }

    @PutMapping("/{wishlistId}")
    @Operation(summary = "Update wishlist", description = "Updates wishlist details for the current user.")
    public ResponseEntity<WishlistDto> updateWishlist(
            @PathVariable String wishlistId,
            @Valid @RequestBody WishlistCreateDto wishlistCreateDto,
            Principal principal
    ) {
        String userId = getCurrentUserId(principal);
        WishlistDto updatedWishlist = wishlistService.updateWishlist(wishlistId, wishlistCreateDto, userId);
        return ResponseEntity.ok(updatedWishlist);
    }

    @DeleteMapping("/{wishlistId}")
    @Operation(summary = "Delete wishlist", description = "Deletes a wishlist for the current user.")
    public ResponseEntity<Void> deleteWishlist(@PathVariable String wishlistId, Principal principal) {
        String userId = getCurrentUserId(principal);
        wishlistService.deleteWishlist(wishlistId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{wishlistId}/add")
    @Operation(summary = "Add product to wishlist", description = "Adds a product to a wishlist.")
    public ResponseEntity<WishlistDto> addProductToWishlist(
            @PathVariable String wishlistId,
            @Valid @RequestBody WishlistAddProductDto wishlistAddProductDto,
            Principal principal
    ) {
        String userId = getCurrentUserId(principal);
        return ResponseEntity.ok(wishlistService.addProductToWishlist(wishlistId, wishlistAddProductDto, userId));
    }

    @DeleteMapping("/{wishlistId}/products/{productId}")
    @Operation(summary = "Remove product from wishlist", description = "Removes a product from a wishlist.")
    public ResponseEntity<WishlistDto> removeProductFromWishlist(
            @PathVariable String wishlistId,
            @PathVariable String productId,
            Principal principal
    ) {
        String userId = getCurrentUserId(principal);
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(wishlistId, productId, userId));
    }

    @GetMapping("/{wishlistId}/products/{productId}/check")
    @Operation(summary = "Check product in wishlist", description = "Checks whether a product exists in a wishlist.")
    public ResponseEntity<Boolean> isProductInUserWishlist(@PathVariable String wishlistId, @PathVariable String productId, Principal principal) {
        String userId = getCurrentUserId(principal);
        return ResponseEntity.ok(wishlistService.isProductInUserWishlists(userId, productId, wishlistId));
    }

    private String getCurrentUserId(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("User is not authenticated");
        }

        String username = principal.getName();
        try {
            return userService.getUserByUsername(username)
                    .getId()
                    .toString();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to get user ID for username: " + username, e);
        }
    }
}
