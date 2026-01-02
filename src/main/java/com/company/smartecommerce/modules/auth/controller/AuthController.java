package com.company.smartecommerce.modules.auth.controller;

import com.company.smartecommerce.common.response.ApiResponse;
import com.company.smartecommerce.modules.auth.dto.LoginRequestDto;
import com.company.smartecommerce.modules.auth.dto.RegisterRequestDto;
import com.company.smartecommerce.modules.auth.dto.AuthResponseDto;
import com.company.smartecommerce.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(
            @Valid @RequestBody RegisterRequestDto registerRequestDto) {
        AuthResponseDto authResponse = authService.register(registerRequestDto);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(
            @Valid @RequestBody LoginRequestDto loginRequestDto) {
        AuthResponseDto authResponse = authService.login(loginRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshToken(
            @RequestParam String refreshToken) {
        AuthResponseDto authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", authResponse));
    }
}