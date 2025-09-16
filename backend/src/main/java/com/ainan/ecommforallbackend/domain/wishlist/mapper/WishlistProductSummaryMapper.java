package com.ainan.ecommforallbackend.domain.wishlist.mapper;

import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistProductSummeryDto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WishlistProductSummaryMapper {
    WishlistProductSummaryMapper INSTANCE = Mappers.getMapper(WishlistProductSummaryMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "minPrice", source = "minPrice")
    @Mapping(target = "brand", source = "brand.name")
    WishlistProductSummeryDto toSummaryDto(Product product);
}