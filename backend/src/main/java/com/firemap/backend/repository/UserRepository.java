package com.firemap.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.firemap.backend.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}