package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.dto.CategoryDto;
import com.ainan.ecommforallbackend.entity.Category;
import com.ainan.ecommforallbackend.util.SlugUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import static java.util.stream.Collectors.toList;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    @Mapping(target = "parent", source = "parent.id")
    @Mapping(target = "subCategories", ignore = true)
    CategoryDto categoryToCategoryDto(Category category);

    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void categoryDtoToCategory(CategoryDto categoryDto, @MappingTarget Category category);

    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "slug", ignore = true)
    Category categoryCreateDtoToCategory(CategoryCreateDto categoryCreateDto);


    
    default CategoryDto mapWithSubCategories(Category category) {
        if(category == null) {
            return null;
        }

        CategoryDto dto = categoryToCategoryDto(category);
        dto.setFullSlug(SlugUtil.buildFullSlug(category));
        if (category.getSubCategories() != null) {
            dto.setSubCategories(category.getSubCategories().stream()
                    .map(Category::getId)
                    .collect(toList()));
        }
        return dto;
    }

}
