package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.CartItemDto;
import com.ainan.ecommforallbackend.dto.ShoppingCartDto;
import com.ainan.ecommforallbackend.entity.CartItem;
import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.entity.ShoppingCart;
import com.ainan.ecommforallbackend.entity.User;
import com.ainan.ecommforallbackend.mapper.CartItemMapper;
import com.ainan.ecommforallbackend.mapper.ShoppingCartMapper;
import com.ainan.ecommforallbackend.repository.CartItemRepository;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import com.ainan.ecommforallbackend.repository.ShoppingCartRepository;
import com.ainan.ecommforallbackend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RequiredArgsConstructor
@Data
@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
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
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
                ShoppingCart newCart = new ShoppingCart();
                newCart.setUser(user);
                shoppingCartRepository.save(newCart);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create shopping cart for user: " + userId, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ShoppingCartDto getShoppingCartByUserId(String userId) {
        UUID userUUID = UUID.fromString(userId);
        return shoppingCartRepository.findByUserId(userUUID)
                .map(shoppingCartMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
    }

    @Override
    @Transactional
    public void clearShoppingCart(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
        cartItemRepository.deleteAllByCartId(shoppingCart.getId());
        shoppingCart.getCartItems().clear();
        shoppingCartRepository.save(shoppingCart);
    }

    @Override
    @Transactional
    public CartItemDto addItemToCart(String userId, String productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        UUID userUUID = UUID.fromString(userId);
        UUID productUUID = UUID.fromString(productId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
        Product product = productRepository.findById(productUUID).orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartIdAndProductId(shoppingCart.getId(), productUUID);
        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            cartItem = existingCartItem.get();
            cartItem.setQuantity(quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(shoppingCart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getMinPrice());
            shoppingCart.getCartItems().add(cartItem);
        }
        cartItemRepository.save(cartItem);
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
        CartItem cartItem = cartItemRepository.findById(cartItemUUID).orElseThrow(() -> new RuntimeException("Cart item not found with ID: " + cartItemId));
        if (!cartItem.getCart().getUser().getId().equals(userUUID)) {
            throw new RuntimeException("Cart item does not belong to user: " + userId);
        }
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return cartItemMapper.toDto(cartItem);
    }

    @Override
    @Transactional
    public void removeItemFromCart(String userId, String cartItemId) {
        UUID userUUID = UUID.fromString(userId);
        UUID cartItemUUID = UUID.fromString(cartItemId);
        CartItem cartItem = cartItemRepository.findById(cartItemUUID)
                .orElseThrow(() -> new RuntimeException("Cart item not found with ID: " + cartItemId));
        if (!cartItem.getCart().getUser().getId().equals(userUUID)) {
            throw new RuntimeException("Cart item does not belong to user: " + userId);
        }
        cartItemRepository.delete(cartItem);

    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemDto> getCartItems(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
        Set<CartItem> cartItems = shoppingCart.getCartItems();
        return cartItems.stream().map(cartItemMapper::toDto)
                .toList();
    }

    @Override
    public int getCartItemCount(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
        return shoppingCart.getCartItems().stream().mapToInt(CartItem::getQuantity).sum();
    }

    @Override
    public double getCartTotalAmount(String userId) {
        UUID userUUID = UUID.fromString(userId);
        ShoppingCart shoppingCart = shoppingCartRepository.findByUserId(userUUID)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));
        return shoppingCart.getCartItems().stream().mapToDouble(item -> item.getUnitPrice().doubleValue() * item.getQuantity()).sum();
    }
}