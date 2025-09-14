package com.ainan.ecommforallbackend.domain.product.mapper;

import com.ainan.ecommforallbackend.domain.product.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {ProductImageMapper.class,
        ProductVariantMapper.class}, nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "brandId", source = "brand.id")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "effectivePrice", expression = "java(product.getEffectivePrice())")
    @Mapping(target = "effectiveStock", expression = "java(product.getEffectiveStock())")
    @Mapping(target = "hasVariants", expression = "java(product.hasVariants())")
    @Mapping(target = "inStock", expression = "java(product.isInStock())")
    ProductDto productToProductDto(Product product);

    @Mapping(target = "brand.id", source = "brandId")
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "seller.id", source = "sellerId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "effectivePrice", ignore = true)
    @Mapping(target = "effectiveStock", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "stock", ignore = true)
    void productDtoToProduct(ProductDto productDto, @MappingTarget Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "minPrice", ignore = true)
    @Mapping(target = "sku", ignore = true)
    Product productCreateDtoToProduct(ProductCreateDto productCreateDto);
}