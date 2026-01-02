package com.company.smartecommerce.modules.auth.service.impl;

import com.company.smartecommerce.common.utils.JwtUtil;
import com.company.smartecommerce.exception.BadRequestException;
import com.company.smartecommerce.modules.auth.dto.LoginRequestDto;
import com.company.smartecommerce.modules.auth.dto.RegisterRequestDto;
import com.company.smartecommerce.modules.auth.dto.AuthResponseDto;
import com.company.smartecommerce.modules.auth.service.AuthService;
import com.company.smartecommerce.modules.user.domain.entity.User;
import com.company.smartecommerce.modules.user.domain.repository.UserRepository;
import com.company.smartecommerce.modules.user.dto.UserRequestDto;
import com.company.smartecommerce.modules.user.mapper.UserMapper;
import com.company.smartecommerce.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDto register(RegisterRequestDto registerRequestDto) {
        // Check if user already exists
        if (userRepository.existsByUsername(registerRequestDto.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Convert register DTO to user DTO
        UserRequestDto userRequestDto = new UserRequestDto();
        userRequestDto.setUsername(registerRequestDto.getUsername());
        userRequestDto.setEmail(registerRequestDto.getEmail());
        userRequestDto.setPassword(registerRequestDto.getPassword());
        userRequestDto.setFirstName(registerRequestDto.getFirstName());
        userRequestDto.setLastName(registerRequestDto.getLastName());
        userRequestDto.setPhoneNumber(registerRequestDto.getPhoneNumber());
        userRequestDto.setRole(registerRequestDto.getRole());

        // Create user
        var userResponse = userService.createUser(userRequestDto);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(userResponse.getUsername(), userResponse.getRole().name());
        
        return new AuthResponseDto(
            token,
            null, // Refresh token not implemented for simplicity
            "Bearer",
            86400000L, // 24 hours
            userResponse
        );
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequestDto.getUsername(),
                    loginRequestDto.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details
            User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            
            var userResponse = userMapper.toResponseDto(user);
            
            return new AuthResponseDto(
                token,
                null, // Refresh token not implemented for simplicity
                "Bearer",
                86400000L, // 24 hours
                userResponse
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid credentials");
        }
    }

    @Override
    public AuthResponseDto refreshToken(String refreshToken) {
        // Refresh token implementation would go here
        // For now, we'll throw an exception since refresh tokens are not fully implemented
        throw new UnsupportedOperationException("Refresh token not implemented");
    }
}