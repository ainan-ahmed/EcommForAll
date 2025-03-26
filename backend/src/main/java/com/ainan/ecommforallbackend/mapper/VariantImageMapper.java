package com.ainan.ecommforallbackend.mapper;

    import com.ainan.ecommforallbackend.dto.VariantImageCreateDto;
    import com.ainan.ecommforallbackend.dto.VariantImageDto;
    import com.ainan.ecommforallbackend.entity.VariantImage;
    import org.mapstruct.Mapper;
    import org.mapstruct.Mapping;
    import org.mapstruct.MappingTarget;
    import org.mapstruct.factory.Mappers;

    @Mapper(componentModel = "spring",
            nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    public interface VariantImageMapper {
        VariantImageMapper INSTANCE = Mappers.getMapper(VariantImageMapper.class);

        @Mapping(target = "variantId", source = "variant.id")
        VariantImageDto variantImageToVariantImageDto(VariantImage variantImage);

        @Mapping(target = "variant.id", source = "variantId")
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "createdAt", ignore = true)
        @Mapping(target = "updatedAt", ignore = true)
        void variantImageDtoToVariantImage(VariantImageDto dto, @MappingTarget VariantImage variantImage);

        @Mapping(target = "id", ignore = true)
        @Mapping(target = "variant.id", source = "variantId")
        @Mapping(target = "createdAt", ignore = true)
        @Mapping(target = "updatedAt", ignore = true)
        VariantImage variantImageCreateDtoToVariantImage(VariantImageCreateDto variantImageCreateDto);
    }