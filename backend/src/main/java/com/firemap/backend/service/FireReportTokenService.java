package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firemap.backend.entity.FireReportTokenEntity;
import com.firemap.backend.repository.FireReportTokenRepository;

import java.util.UUID;

@Service
@Transactional
public class FireReportTokenService {

    private final FireReportTokenRepository tokenRepository;

    public FireReportTokenService(FireReportTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // 새로운 토큰 생성 및 저장
    public FireReportTokenEntity createToken() {
        String token = UUID.randomUUID().toString();
        FireReportTokenEntity fireReportToken = FireReportTokenEntity.builder()
            .token(token)
            .build();
        return tokenRepository.save(fireReportToken);
    }

    // 토큰 존재 여부 확인
    // public boolean isValidToken(String token) {
    //     return tokenRepository.findByToken(token).isPresent();
    // }
    public boolean isValidToken(String token) {
        try {
            boolean result = tokenRepository.findByToken(token).isPresent();
            System.out.println("✅ 토큰 유효성 검사 결과: " + result);
            return result;
        } catch (Exception e) {
            System.out.println("❌ 토큰 검증 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
