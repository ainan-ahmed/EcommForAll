package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.dto.ProductDto;
import com.ainan.ecommforallbackend.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        uses = {ProductImageMapper.class, ProductVariantMapper.class},
        nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "brandId", source = "brand.id")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "minPrice", source = "minPrice")
    ProductDto productToProductDto(Product product);

    @Mapping(target = "brand.id", source = "brandId")
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "seller.id", source = "sellerId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void productDtoToProduct(ProductDto productDto, @MappingTarget Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand.id", source = "brandId")
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "seller.id", source = "sellerId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    Product productCreateDtoToProduct(ProductCreateDto productCreateDto);
}