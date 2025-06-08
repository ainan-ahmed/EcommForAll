package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.CartItemDto;
import com.ainan.ecommforallbackend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CartItemMapper {

    CartItemMapper INSTANCE = Mappers.getMapper(CartItemMapper.class);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productDescription", source = "product.description")
    @Mapping(target = "productPrice", source = "unitPrice")
    @Mapping(target = "productImageUrl", ignore = true)
    @Mapping(target = "inStock", source = "product.isActive")
    @Mapping(target = "totalPrice", expression = "java(cartItem.getTotalPrice())")
    CartItemDto toDto(CartItem cartItem);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "unitPrice", source = "cartItemDto.productPrice")
    @Mapping(target = "quantity", source = "cartItemDto.quantity")
    CartItem toEntity(CartItemDto cartItemDto);
}