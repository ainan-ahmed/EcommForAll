package com.ainan.ecommforallbackend.domain.wishlist.mapper;

import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistDto;
import com.ainan.ecommforallbackend.domain.wishlist.entity.Wishlist;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {
        WishlistProductSummaryMapper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WishlistMapper {

    WishlistMapper INSTANCE = Mappers.getMapper(WishlistMapper.class);

    @Mapping(target = "userId", source = "user.id")
    WishlistDto toDto(Wishlist wishlist);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Wishlist toEntity(WishlistCreateDto wishlistCreateDto);

}