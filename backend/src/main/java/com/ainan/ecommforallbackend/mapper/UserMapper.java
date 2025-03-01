package com.ainan.ecommforallbackend.mapper;

import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.entity.User;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    UserDto UserToUserDto(User user);
    User UserDtoToUser(UserDto userDto);

    User UserAuthDtoToUser(UserAuthDto dto);
    @InheritInverseConfiguration
    UserAuthDto UserToUserAuthDto(User user);
}
