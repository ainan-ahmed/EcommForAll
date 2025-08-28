package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.ReviewCreateDto;
import com.ainan.ecommforallbackend.dto.ReviewDto;
import com.ainan.ecommforallbackend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {

    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review ReviewCreateDtoToReview(ReviewCreateDto reviewDto);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "user", source = "user")
    ReviewDto toDto(Review review);


    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "user.id", source = "userId")
    Review toEntity(ReviewDto reviewDto, @MappingTarget Review review);

}
