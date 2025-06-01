package com.firemap.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.firemap.backend.entity.FireReportEntity;
import com.firemap.backend.entity.FireReportToken;

import java.util.Optional;

public interface FireReportRepository extends JpaRepository<FireReportEntity, Long> {
    Optional<FireReportEntity> findByReportToken(FireReportToken reportToken);
}