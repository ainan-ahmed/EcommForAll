package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.WishlistAddProductDto;
import com.ainan.ecommforallbackend.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
    List<WishlistDto> getUserWishlists(String userId);

    WishlistDto getWishlistById(String wishlistId, String userId);

    WishlistDto createWishlist(WishlistCreateDto wishlistCreateDto, String userId);

    WishlistDto updateWishlist(String wishlistId, WishlistCreateDto request, String userId);

    void deleteWishlist(String wishlistId, String userId);

    WishlistDto addProductToWishlist(String wishlistId, WishlistAddProductDto wishlistAddProductDto, String userId);

    WishlistDto removeProductFromWishlist(String wishlistId, String productId, String userId);

    boolean isProductInUserWishlists(String userId, String productId, String wishlistId);

    boolean createDefaultWishlistIfNotExists(String userId);
}
