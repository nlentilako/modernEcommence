package com.company.smartecommerce.modules.user.controller;

import com.company.smartecommerce.common.response.ApiResponse;
import com.company.smartecommerce.modules.user.dto.UserRequestDto;
import com.company.smartecommerce.modules.user.dto.UserResponseDto;
import com.company.smartecommerce.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserRequestDto userRequestDto) {
        UserResponseDto user = userService.createUser(userRequestDto);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserByUsername(@PathVariable String username) {
        UserResponseDto user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAllUsers(Pageable pageable) {
        Page<UserResponseDto> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody UserRequestDto userRequestDto) {
        UserResponseDto updatedUser = userService.updateUser(id, userRequestDto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getUsersByRole(
            @PathVariable com.company.smartecommerce.common.enums.UserRole role) {
        List<UserResponseDto> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}