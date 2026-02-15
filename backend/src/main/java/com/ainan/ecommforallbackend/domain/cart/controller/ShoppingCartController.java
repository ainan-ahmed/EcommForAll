package com.ainan.ecommforallbackend.domain.cart.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.cart.dto.CartItemCreateDto;
import com.ainan.ecommforallbackend.domain.cart.dto.CartItemDto;
import com.ainan.ecommforallbackend.domain.cart.dto.ShoppingCartDto;
import com.ainan.ecommforallbackend.domain.cart.service.ShoppingCartService;
import com.ainan.ecommforallbackend.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Shopping cart retrieval and item management")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final UserService userService;


    @GetMapping()
    @Operation(summary = "Get current cart", description = "Returns the authenticated user's shopping cart.")
    public ResponseEntity<ShoppingCartDto> getShoppingCart(Principal principal) {
        String userId = getCurrentUserId(principal);
        ShoppingCartDto shoppingCart = shoppingCartService.getShoppingCartByUserId(userId);
        return ResponseEntity.ok(shoppingCart);
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Adds a product or variant to the cart with quantity.")
    public ResponseEntity<CartItemDto> addProductToShoppingCart(@RequestBody CartItemCreateDto request, Principal principal) {
        String userId = getCurrentUserId(principal);
        String productId = request.getProductId();
        String variantId = request.getVariantId();
        int quantity = request.getQuantity();
        CartItemDto cartItemDto = shoppingCartService.addItemToCart(userId, productId, variantId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemDto);
    }

    @GetMapping("/items")
    @Operation(summary = "List cart items", description = "Returns all items currently in the user's cart.")
    public ResponseEntity<List<CartItemDto>> getCartItems(Principal principal) {
        String userId = getCurrentUserId(principal);
        List<CartItemDto> cartItems = shoppingCartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Update cart item", description = "Updates quantity for a specific cart item.")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable String cartItemId, @RequestBody CartItemDto request, Principal principal) {
        String userId = getCurrentUserId(principal);
        CartItemDto updatedCartItem = shoppingCartService.updateCartItem(userId, cartItemId, request.getQuantity());
        return ResponseEntity.ok(updatedCartItem);
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Remove cart item", description = "Removes a single item from the cart.")
    public ResponseEntity<Void> removeCartItem(@PathVariable String cartItemId, Principal principal) {
        String userId = getCurrentUserId(principal);
        shoppingCartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items/clearCart")
    @Operation(summary = "Clear cart", description = "Removes all items from the current user's cart.")
    public ResponseEntity<Void> clearShoppingCart(Principal principal) {
        String userId = getCurrentUserId(principal);
        shoppingCartService.clearShoppingCart(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items/count")
    @Operation(summary = "Get cart item count", description = "Returns the number of items in the cart.")
    public ResponseEntity<Integer> getCartItemCount(Principal principal) {
        String userId = getCurrentUserId(principal);
        int itemCount = shoppingCartService.getCartItemCount(userId);
        return ResponseEntity.ok(itemCount);
    }

    @GetMapping("/items/total")
    @Operation(summary = "Get cart total", description = "Returns the total amount for the cart contents.")
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
