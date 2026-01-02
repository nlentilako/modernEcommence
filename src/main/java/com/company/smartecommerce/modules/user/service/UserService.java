package com.company.smartecommerce.modules.user.service;

import com.company.smartecommerce.modules.user.dto.UserRequestDto;
import com.company.smartecommerce.modules.user.dto.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponseDto createUser(UserRequestDto userRequestDto);
    UserResponseDto getUserById(Long id);
    UserResponseDto getUserByUsername(String username);
    Page<UserResponseDto> getAllUsers(Pageable pageable);
    UserResponseDto updateUser(Long id, UserRequestDto userRequestDto);
    void deleteUser(Long id);
    List<UserResponseDto> getUsersByRole(com.company.smartecommerce.common.enums.UserRole role);
}