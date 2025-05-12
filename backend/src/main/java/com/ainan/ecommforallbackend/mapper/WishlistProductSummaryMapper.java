package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.WishlistProductSummeryDto;
import com.ainan.ecommforallbackend.entity.Product;
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