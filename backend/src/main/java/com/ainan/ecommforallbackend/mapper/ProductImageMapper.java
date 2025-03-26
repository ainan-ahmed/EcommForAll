package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.ProductImageCreateDto;
import com.ainan.ecommforallbackend.dto.ProductImageDto;
import com.ainan.ecommforallbackend.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface ProductImageMapper {
    ProductImageMapper INSTANCE = Mappers.getMapper(ProductImageMapper.class);

    @Mapping(target = "productId", source = "product.id")
    ProductImageDto productImageToProductImageDto(ProductImage productImage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "createdAt", ignore = true)
    void productImageDtoToProductImage(ProductImageDto productImageDto, @MappingTarget ProductImage productImage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "createdAt", ignore = true)
    ProductImage productImageCreateDtoToProductImage(ProductImageCreateDto productImageCreateDto);
}