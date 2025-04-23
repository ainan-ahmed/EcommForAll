package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.CategoryCreateDto;
import com.ainan.ecommforallbackend.dto.CategoryDto;
import com.ainan.ecommforallbackend.entity.Category;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import com.ainan.ecommforallbackend.util.SlugUtil;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

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


    
    default CategoryDto mapWithSubCategories(Category category, @Context ProductRepository productRepository) {
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
//        int totalProduct = calculateTotalProductCount(category);
        dto.setProductCount(calculateTotalProductCount(category, productRepository));
        return dto;
    }
    default int calculateTotalProductCount(Category category, @Context ProductRepository productRepository) {
        if (category == null) {
            return 0;
        }
        long directCount = productRepository.countByCategoryId(category.getId());
        long subcategoryCount = 0;
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            subcategoryCount = category.getSubCategories().stream()
                    .mapToLong(cat -> calculateTotalProductCount(cat, productRepository))
                    .sum();
        }
        return (int)(directCount + subcategoryCount);
    }


}
