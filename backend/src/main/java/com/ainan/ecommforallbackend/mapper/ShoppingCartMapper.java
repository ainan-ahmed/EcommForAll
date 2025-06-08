package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.ShoppingCartDto;
import com.ainan.ecommforallbackend.entity.ShoppingCart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ShoppingCartMapper {

    ShoppingCartMapper INSTANCE = Mappers.getMapper(ShoppingCartMapper.class);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "items", source = "cartItems")
    @Mapping(target = "totalItems", expression = "java(shoppingCart.getCartItems() != null ? shoppingCart.getCartItems().size() : 0)")
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmount(shoppingCart))")
    ShoppingCartDto toDto(ShoppingCart shoppingCart);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "cartItems", source = "items")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ShoppingCart toEntity(ShoppingCartDto shoppingCartDto);

    default java.math.BigDecimal calculateTotalAmount(ShoppingCart cart) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            return java.math.BigDecimal.ZERO;
        }
        return cart.getCartItems().stream()
                .map(item -> item.getTotalPrice())
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
}