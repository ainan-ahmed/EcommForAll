package com.ainan.ecommforallbackend.domain.user.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    UserDto UserToUserDto(User user);
    User UserDtoToUser(UserDto userDto);

    User UserAuthDtoToUser(UserAuthDto dto);
    @InheritInverseConfiguration
    UserAuthDto UserToUserAuthDto(User user);
}
