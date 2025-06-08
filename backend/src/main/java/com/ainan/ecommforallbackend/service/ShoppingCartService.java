package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.CartItemDto;
import com.ainan.ecommforallbackend.dto.ShoppingCartDto;

import java.util.List;

public interface ShoppingCartService {
    void createShoppingCartIfNotExists(String userId);

    ShoppingCartDto getShoppingCartByUserId(String userId);

    void clearShoppingCart(String userId);

    CartItemDto addItemToCart(String userId, String productId, int quantity);

    CartItemDto updateCartItem(String userId, String cartItemId, int quantity);

    void removeItemFromCart(String userId, String cartItemId);

    List<CartItemDto> getCartItems(String userId);

    int getCartItemCount(String userId);

    double getCartTotalAmount(String userId);


}
