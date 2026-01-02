package com.company.smartecommerce.modules.auth.service;

import com.company.smartecommerce.modules.auth.dto.LoginRequestDto;
import com.company.smartecommerce.modules.auth.dto.RegisterRequestDto;
import com.company.smartecommerce.modules.auth.dto.AuthResponseDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto registerRequestDto);
    AuthResponseDto login(LoginRequestDto loginRequestDto);
    AuthResponseDto refreshToken(String refreshToken);
}