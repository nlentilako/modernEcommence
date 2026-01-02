package com.company.smartecommerce.modules.user.service.impl;

import com.company.smartecommerce.exception.ResourceNotFoundException;
import com.company.smartecommerce.modules.user.domain.entity.User;
import com.company.smartecommerce.modules.user.domain.repository.UserRepository;
import com.company.smartecommerce.modules.user.dto.UserRequestDto;
import com.company.smartecommerce.modules.user.dto.UserResponseDto;
import com.company.smartecommerce.modules.user.mapper.UserMapper;
import com.company.smartecommerce.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        // Check if user already exists
        if (userRepository.existsByUsername(userRequestDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Map DTO to entity and encode password
        User user = userMapper.toEntity(userRequestDto);
        user.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));

        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(com.company.smartecommerce.common.enums.UserRole.CUSTOMER);
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponseDto(savedUser);
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponseDto(user);
    }

    @Override
    public UserResponseDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return userMapper.toResponseDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponseDto);
    }

    @Override
    public UserResponseDto updateUser(Long id, UserRequestDto userRequestDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if username or email is being changed and if it already exists
        if (!existingUser.getUsername().equals(userRequestDto.getUsername()) && 
            userRepository.existsByUsername(userRequestDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (!existingUser.getEmail().equals(userRequestDto.getEmail()) && 
            userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Update user details
        userMapper.updateEntityFromDto(userRequestDto, existingUser);
        
        // Update password if provided
        if (userRequestDto.getPassword() != null && !userRequestDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsersByRole(com.company.smartecommerce.common.enums.UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(userMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}