package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import com.firemap.backend.entity.UserEntity;
import com.firemap.backend.repository.UserRepository;
import com.firemap.backend.dto.UserDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository repo) {
        this.userRepository = repo;
    }

    public UserDto createUser(UserDto dto) {
        UserEntity entity = UserEntity.builder()
                .role(dto.getRole())
                .name(dto.getName())
                .phone(dto.getPhone())
                .createdAt(LocalDateTime.now())
                .build();

        UserEntity saved = userRepository.save(entity);
        dto.setId(saved.getId());
        dto.setCreatedAt(saved.getCreatedAt());
        return dto;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(entity -> new UserDto(
                    entity.getId(),
                    entity.getRole(),
                    entity.getName(),
                    entity.getPhone(),
                    entity.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
