package com.firemap.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.firemap.backend.entity.ChatLogEntity;

public interface ChatLogRepository extends JpaRepository<ChatLogEntity, Long> {
}
