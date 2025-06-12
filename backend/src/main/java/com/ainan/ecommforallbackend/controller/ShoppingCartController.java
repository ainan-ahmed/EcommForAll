package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.CartItemCreateDto;
import com.ainan.ecommforallbackend.dto.CartItemDto;
import com.ainan.ecommforallbackend.dto.ShoppingCartDto;
import com.ainan.ecommforallbackend.service.ShoppingCartService;
import com.ainan.ecommforallbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final UserService userService;


    @GetMapping()
    public ResponseEntity<ShoppingCartDto> getShoppingCart(Principal principal) {
        String userId = getCurrentUserId(principal);
        ShoppingCartDto shoppingCart = shoppingCartService.getShoppingCartByUserId(userId);
        return ResponseEntity.ok(shoppingCart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemDto> addProductToShoppingCart(@RequestBody CartItemCreateDto request, Principal principal) {
        String userId = getCurrentUserId(principal);
        String productId = request.getProductId();
        String variantId = request.getVariantId();
        int quantity = request.getQuantity();
        CartItemDto cartItemDto = shoppingCartService.addItemToCart(userId, productId, variantId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemDto);
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItemDto>> getCartItems(Principal principal) {
        String userId = getCurrentUserId(principal);
        List<CartItemDto> cartItems = shoppingCartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable String cartItemId, @RequestBody CartItemDto request, Principal principal) {
        String userId = getCurrentUserId(principal);
        CartItemDto updatedCartItem = shoppingCartService.updateCartItem(userId, cartItemId, request.getQuantity());
        return ResponseEntity.ok(updatedCartItem);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable String cartItemId, Principal principal) {
        String userId = getCurrentUserId(principal);
        shoppingCartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items/clearCart")
    public ResponseEntity<Void> clearShoppingCart(Principal principal) {
        String userId = getCurrentUserId(principal);
        shoppingCartService.clearShoppingCart(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items/count")
    public ResponseEntity<Integer> getCartItemCount(Principal principal) {
        String userId = getCurrentUserId(principal);
        int itemCount = shoppingCartService.getCartItemCount(userId);
        return ResponseEntity.ok(itemCount);
    }

    @GetMapping("/items/total")
    public ResponseEntity<Double> getCartTotalAmount(Principal principal) {
        String userId = getCurrentUserId(principal);
        double totalAmount = shoppingCartService.getCartTotalAmount(userId);
        return ResponseEntity.ok(totalAmount);
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
