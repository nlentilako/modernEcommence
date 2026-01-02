package com.company.smartecommerce.modules.user.domain.entity;

import com.company.smartecommerce.common.base.BaseEntity;
import com.company.smartecommerce.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isActive = true;
    private String profilePictureUrl;
}