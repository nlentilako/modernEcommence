package com.company.smartecommerce.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private com.company.smartecommerce.modules.user.dto.UserResponseDto user;
}