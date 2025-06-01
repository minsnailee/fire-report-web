package com.firemap.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.firemap.backend.entity.FireReportToken;

import java.util.Optional;

public interface FireReportTokenRepository extends JpaRepository<FireReportToken, Long> {
    Optional<FireReportToken> findByToken(String token);
}
