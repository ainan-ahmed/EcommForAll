package com.ainan.ecommforallbackend.domain.cart.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.cart.dto.CartItemDto;
import com.ainan.ecommforallbackend.domain.cart.dto.ShoppingCartDto;
import com.ainan.ecommforallbackend.domain.cart.entity.CartItem;
import com.ainan.ecommforallbackend.domain.cart.entity.ShoppingCart;
import com.ainan.ecommforallbackend.domain.cart.mapper.CartItemMapper;
import com.ainan.ecommforallbackend.domain.cart.mapper.ShoppingCartMapper;
import com.ainan.ecommforallbackend.domain.cart.repository.CartItemRepository;
import com.ainan.ecommforallbackend.domain.cart.repository.ShoppingCartRepository;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.entity.ProductVariant;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductVariantRepository;
import com.ainan.ecommforallbackend.domain.product.service.ProductImageService;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductImageService productImageService;
    private final UserRepository userRepository;
    private final ShoppingCartMapper shoppingCartMapper;
    private final CartItemMapper cartItemMapper;

    @Override
    @Transactional
    public void createShoppingCartIfNotExists(String userId) {
        try {
            UUID userUUID = UUID.fromString(userId);
            Optional<ShoppingCart> existingCart = shoppingCartRepository.findByUserId(userUUID);

            if (existingCart.isEmpty()) {
                User user = userRepository.findById(userUUID)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
                ShoppingCart newCart = new ShoppingCart();
                newCart.setUser(user);
                newCart.setStatus(true);
                shoppingCartRepository.save(newCart);
                log.info("Created shopping cart for user: {}", userId);
            }
        } catch (Exception e) {
            log.error("Failed to create shopping cart for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to create shopping cart for user: " + userId, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ShoppingCartDto getShoppingCartByUserId(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart cart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping cart not found for user: " + userId));
        ShoppingCartDto cartDto = shoppingCartMapper.toDto(cart);

        List<CartItemDto> cartItems = cart.getCartItems().stream()
                .map(cartItemMapper::toDto)
                .collect(Collectors.toList());

        cartDto.setItems(addPrimaryImagesToCartItems(cartItems));
        return cartDto;
    }

    @Override
    @Transactional
    public CartItemDto addItemToCart(String userId, String productId, String variantId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        UUID userUUID = UUID.fromString(userId);
        UUID productIdUUID = UUID.fromString(productId);
        UUID variantIdUUID = variantId != null ? UUID.fromString(variantId) : null;

        ShoppingCart cart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping cart not found for user: " + userId));

        Product product = productRepository.findById(productIdUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingCartItem;
        if (variantId != null) {
            existingCartItem = cartItemRepository.findByCartIdAndProductIdAndVariantId(
                    cart.getId(), productIdUUID, variantIdUUID);
        } else {
            existingCartItem = cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(
                    cart.getId(), productIdUUID);
        }

        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            // Update existing item - add to existing quantity, keep original price
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity());
            log.info("Updated existing cart item for user {}, product {}: quantity {} -> {}, price remains {}",
                    userId, productId, cartItem.getQuantity() - quantity, cartItem.getQuantity(),
                    cartItem.getUnitPrice());
        } else {
            // Create new item
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);

            // Set variant and price based on product type
            if (variantId != null) {
                // Product with variant
                ProductVariant variant = productVariantRepository.findById(variantIdUUID)
                        .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
                cartItem.setVariant(variant);
                cartItem.setUnitPrice(variant.getPrice()); // Lock variant price
                log.info(
                        "Added new cart item with variant for user {}, product {}, variant {}: quantity {}, locked price {}",
                        userId, productId, variantId, quantity, variant.getPrice());
            } else {
                // Product without variant - use product's own price
                if (product.getPrice() == null) {
                    throw new IllegalStateException("Product has no price and no variants available");
                }
                cartItem.setVariant(null);
                cartItem.setUnitPrice(product.getPrice()); // Lock product price
                log.info("Added new cart item for user {}, product {}: quantity {}, locked price {}",
                        userId, productId, quantity, product.getPrice());
            }

            // Add to cart's collection for bidirectional sync
            cart.getCartItems().add(cartItem);
        }

        // Save only the owning side (CartItem)
        cartItem = cartItemRepository.save(cartItem);
        return cartItemMapper.toDto(cartItem);
    }

    @Override
    @Transactional
    public CartItemDto updateCartItem(String userId, String cartItemId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        UUID userUUID = UUID.fromString(userId);
        UUID cartItemUUID = UUID.fromString(cartItemId);

        CartItem cartItem = cartItemRepository.findById(cartItemUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getUser().getId().equals(userUUID)) {
            throw new IllegalArgumentException("Cart item does not belong to user: " + userId);
        }

        // Update quantity but keep original price
        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);

        log.info("Updated cart item quantity for user {}, cart item {}: new quantity {}, price remains {}",
                userId, cartItemId, quantity, cartItem.getUnitPrice());

        return cartItemMapper.toDto(cartItem);
    }

    @Override
    @Transactional
    public void removeItemFromCart(String userId, String cartItemId) {
        UUID userUUID = UUID.fromString(userId);
        UUID cartItemUUID = UUID.fromString(cartItemId);

        CartItem cartItem = cartItemRepository.findById(cartItemUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getUser().getId().equals(userUUID)) {
            throw new IllegalArgumentException("Cart item does not belong to user: " + userId);
        }

        cartItemRepository.delete(cartItem);
        log.info("Removed cart item {} for user {}", cartItemId, userId);
    }

    @Override
    @Transactional
    public void clearShoppingCart(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping cart not found for user: " + userId));

        cartItemRepository.deleteAllByCartId(shoppingCart.getId());
        // Clear the collection for bidirectional sync
        shoppingCart.getCartItems().clear();
        log.info("Cleared shopping cart for user {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemDto> getCartItems(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping cart not found for user: " + userId));

        return shoppingCart.getCartItems().stream()
                .map(cartItemMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public int getCartItemCount(String userId) {
        UUID userUUID = UUID.fromString(userId);
        Optional<ShoppingCart> cart = shoppingCartRepository.findByUserId(userUUID);

        return cart.map(shoppingCart -> shoppingCart.getCartItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum()).orElse(0);

    }

    @Override
    public double getCartTotalAmount(String userId) {
        UUID userUUID = UUID.fromString(userId);
        Optional<ShoppingCart> cart = shoppingCartRepository.findByUserId(userUUID);

        return cart.map(shoppingCart -> shoppingCart.getCartItems().stream()
                .mapToDouble(item -> item.getUnitPrice().doubleValue() * item.getQuantity())
                .sum()).orElse(0.0);

    }

    private List<CartItemDto> addPrimaryImagesToCartItems(List<CartItemDto> cartItemDtos) {
        cartItemDtos.forEach(cartItemDto -> {
            UUID imageProductId = cartItemDto.getProductId();
            // Only fetch images if we have a valid product ID
            try {
                Page<ProductImageDto> primaryImages = productImageService.getImagesByProductId(
                        imageProductId,
                        PageRequest.of(0, 1));

                if (!primaryImages.getContent().isEmpty()) {
                    cartItemDto.setImageUrl(primaryImages.getContent().get(0));
                }
            } catch (Exception e) {
                log.warn("Failed to fetch primary image for product {}: {}", imageProductId, e.getMessage());
                // Set a default image or leave null
                cartItemDto.setImageUrl(null);
            }
        });
        return cartItemDtos;
    }

    ;

}