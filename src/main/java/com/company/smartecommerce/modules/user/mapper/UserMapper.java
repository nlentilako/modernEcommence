package com.company.smartecommerce.modules.user.mapper;

import com.company.smartecommerce.modules.user.domain.entity.User;
import com.company.smartecommerce.modules.user.dto.UserRequestDto;
import com.company.smartecommerce.modules.user.dto.UserResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User toEntity(UserRequestDto dto);
    
    UserResponseDto toResponseDto(User entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "password", ignore = true) // Don't update password if not provided
    void updateEntityFromDto(UserRequestDto dto, @MappingTarget User entity);
}