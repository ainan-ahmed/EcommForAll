package com.ainan.ecommforallbackend.domain.brand.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import com.ainan.ecommforallbackend.domain.brand.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.domain.brand.dto.BrandDto;
import com.ainan.ecommforallbackend.domain.brand.entity.Brand;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BrandMapper {
     BrandMapper INSTANCE = Mappers.getMapper(BrandMapper.class);
     BrandDto BrandToBrandDto(Brand brand);
     void BrandDtoToBrand(BrandDto brandDto, @MappingTarget Brand brand);

     Brand BrandCreateDtoToBrand(BrandCreateDto brandCreateDto);
}
