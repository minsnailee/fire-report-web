package com.firemap.backend.dto;

import java.time.LocalDateTime;

import com.firemap.backend.entity.UserEntity.Role;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private Role role;
    private String name;
    private String phone;
    private LocalDateTime createdAt;
}