package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.BrandCreateDto;
import com.ainan.ecommforallbackend.dto.BrandDto;
import com.ainan.ecommforallbackend.entity.Brand;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BrandMapper {
     BrandMapper INSTANCE = Mappers.getMapper(BrandMapper.class);
     BrandDto BrandToBrandDto(Brand brand);
     void BrandDtoToBrand(BrandDto brandDto, @MappingTarget Brand brand);

     Brand BrandCreateDtoToBrand(BrandCreateDto brandCreateDto);
}
