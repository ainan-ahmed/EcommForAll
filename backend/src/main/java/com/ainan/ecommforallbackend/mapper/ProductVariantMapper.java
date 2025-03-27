package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.ProductVariantCreateDto;
import com.ainan.ecommforallbackend.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        uses = {VariantImageMapper.class},
        nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface ProductVariantMapper {
    ProductVariantMapper INSTANCE = Mappers.getMapper(ProductVariantMapper.class);

    @Mapping(target = "productId", source = "product.id")
    ProductVariantDto productVariantToProductVariantDto(ProductVariant productVariant);

    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void productVariantDtoToProductVariant(ProductVariantDto productVariantDto, @MappingTarget ProductVariant productVariant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    ProductVariant productVariantCreateDtoToProductVariant(ProductVariantCreateDto productVariantCreateDto);
}