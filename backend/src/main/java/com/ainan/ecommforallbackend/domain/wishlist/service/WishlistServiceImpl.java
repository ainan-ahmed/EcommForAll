package com.ainan.ecommforallbackend.domain.wishlist.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.service.ProductImageService;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistAddProductDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistProductSummeryDto;
import com.ainan.ecommforallbackend.domain.wishlist.entity.Wishlist;
import com.ainan.ecommforallbackend.domain.wishlist.mapper.WishlistMapper;
import com.ainan.ecommforallbackend.domain.wishlist.mapper.WishlistProductSummaryMapper;
import com.ainan.ecommforallbackend.domain.wishlist.repository.WishlistRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@RequiredArgsConstructor
@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistMapper wishlistMapper;
    private final WishlistProductSummaryMapper wishlistProductSummaryMapper;
    private final ProductImageService productImageService;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistDto> getUserWishlists(String userId) {
        return wishlistRepository.findAllByUserId(UUID.fromString(userId)).stream()
                .map(wishlistMapper::toDto)
                .map(wishlistDto -> {
                    if (wishlistDto.getProducts() != null && !wishlistDto.getProducts().isEmpty()) {
                        // Convert Set to List for processing
                        List<WishlistProductSummeryDto> productsList = new ArrayList<>(wishlistDto.getProducts());
                        // Add images
                        List<WishlistProductSummeryDto> productDtosWithImages = addPrimaryImagesToWishlistProducts(productsList);
                        // Convert back to Set
                        wishlistDto.setProducts(new HashSet<>(productDtosWithImages));
                    }
                    return wishlistDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistDto getWishlistById(String wishlistId, String userId) {
        UUID userUUID = UUID.fromString(userId);
        UUID wishlistUUID = UUID.fromString(wishlistId);
        Wishlist wishlist = wishlistRepository.findByIdAndUserId(wishlistUUID, userUUID).orElseThrow(() -> new ResourceNotFoundException("Wishlist not found or does not belong to the user"));
        WishlistDto wishlistDto = wishlistMapper.toDto(wishlist);

        // Add primary images to products, just like in getUserWishlists
        if (wishlistDto.getProducts() != null && !wishlistDto.getProducts().isEmpty()) {
            List<WishlistProductSummeryDto> productsList = new ArrayList<>(wishlistDto.getProducts());
            List<WishlistProductSummeryDto> productDtosWithImages = addPrimaryImagesToWishlistProducts(productsList);
            wishlistDto.setProducts(new HashSet<>(productDtosWithImages));
        }

        return wishlistDto;
    }

    @Override
    @Transactional
    public WishlistDto createWishlist(WishlistCreateDto wishlistCreateDto, String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Wishlist wishlist = wishlistMapper.toEntity(wishlistCreateDto);
        wishlist.setUser(user);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(savedWishlist);
    }

    @Override
    @Transactional
    public WishlistDto updateWishlist(String wishlistId, WishlistCreateDto wishlistCreateDto, String userId) {
        Wishlist wishlist = findWishlistByIdAndUserId(wishlistId, userId);
        wishlist.setName(wishlistCreateDto.getName());
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(updatedWishlist);
    }

    @Override
    @Transactional
    public void deleteWishlist(String wishlistId, String userId) {
        Wishlist wishlist = findWishlistByIdAndUserId(wishlistId, userId);
        wishlistRepository.delete(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto addProductToWishlist(String wishlistId, WishlistAddProductDto wishlistAddProductDto, String userId) {
        Wishlist wishlist = findWishlistByIdAndUserId(wishlistId, userId);
        Product product = productRepository.findById(UUID.fromString(wishlistAddProductDto.getProductId()))
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        wishlist.getProducts().add(product);
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDto(updatedWishlist);
    }

    @Override
    @Transactional
    public WishlistDto removeProductFromWishlist(String wishlistId, String productId, String userId) {
        Wishlist wishlist = findWishlistByIdAndUserId(wishlistId, userId);
        wishlist.getProducts().removeIf(product -> product.getId().equals(UUID.fromString(productId)));
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDto(updatedWishlist);
    }

    @Override
    @Transactional
    public boolean createDefaultWishlistIfNotExists(String userId) {
        UUID userUuid = UUID.fromString(userId);
        List<Wishlist> existingWishlists = wishlistRepository.findAllByUserId(userUuid);
        if (existingWishlists.isEmpty()) {
            User user = userRepository.findById(userUuid)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            WishlistCreateDto defaultWishlist = new WishlistCreateDto();
            defaultWishlist.setName("Favorites");

            Wishlist wishlist = wishlistMapper.toEntity(defaultWishlist);
            wishlist.setUser(user);
            wishlistRepository.save(wishlist);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public boolean isProductInUserWishlists(String userId, String productId, String wishlistId) {
        UUID userUUID = UUID.fromString(userId);
        UUID productUUID = UUID.fromString(productId);
        UUID wishlistUUID = UUID.fromString(wishlistId);
        return wishlistRepository.existsByIdAndUserIdAndProductsId(wishlistUUID, userUUID, productUUID);
    }

    private Wishlist findWishlistByIdAndUserId(String wishlistId, String userId) {
        UUID wishlistUUID = UUID.fromString(wishlistId);
        UUID userUUID = UUID.fromString(userId);
        return wishlistRepository.findByIdAndUserId(wishlistUUID, userUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found or does not belong to the user"));
    }

    private List<WishlistProductSummeryDto> addPrimaryImagesToWishlistProducts(List<WishlistProductSummeryDto> productDtos) {
        productDtos.forEach(productDto -> {
            Page<ProductImageDto> primaryImages = productImageService.getImagesByProductId(
                    productDto.getId(),
                    PageRequest.of(0, 1)
            );

            if (!primaryImages.getContent().isEmpty()) {
                productDto.setPrimaryImage(primaryImages.getContent().get(0));
            }
        });

        return productDtos;
    }
}