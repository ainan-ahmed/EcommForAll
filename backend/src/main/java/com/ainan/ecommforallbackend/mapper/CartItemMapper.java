package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.CartItemDto;
import com.ainan.ecommforallbackend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(target = "productId", source = "cartItem.product.id")
    @Mapping(target = "productName", source = "cartItem.product.name")
    @Mapping(target = "productDescription", source = "cartItem.product.description")
    @Mapping(target = "variantId", source = "cartItem.variant.id")
    @Mapping(target = "variantSku", source = "cartItem.variant.sku")
    @Mapping(target = "variantAttributes", source = "cartItem.variant.attributeValues")
    @Mapping(target = "inStock", expression = "java(isInStock(cartItem))")
    CartItemDto toDto(CartItem cartItem);

    @Mapping(target = "variant", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    CartItem toEntity(CartItemDto cartItemDto);

    default boolean isInStock(CartItem cartItem) {
        if (cartItem.getVariant() != null) {
            Integer variantStock = cartItem.getVariant().getStock();
            return variantStock != null && variantStock > 0;
        } else {
            Integer productStock = cartItem.getProduct().getStock();
            return productStock != null && productStock > 0;
        }
    }
}