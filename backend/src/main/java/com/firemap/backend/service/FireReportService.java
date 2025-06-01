package com.firemap.backend.service;
import java.util.List;

import org.springframework.stereotype.Service;
import com.firemap.backend.entity.*;
import com.firemap.backend.enums.FireReportStatus;
import com.firemap.backend.repository.*;

import jakarta.transaction.Transactional;

import com.firemap.backend.dto.*;

@Service
@Transactional
public class FireReportService {

    private final FireReportRepository reportRepository;
    private final FireReportTokenRepository tokenRepository;

    public FireReportService(FireReportRepository reportRepository, FireReportTokenRepository tokenRepository) {
        this.reportRepository = reportRepository;
        this.tokenRepository = tokenRepository;
    }

    public FireReportDto saveReport(FireReportRequest request) {
        FireReportToken token = tokenRepository.findByToken(request.getReportedId())
            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        // 토큰으로 기존 신고가 있는지 확인
        FireReportEntity report = reportRepository.findByReportToken(token).orElse(null);

        if (report == null) {
            // 최초 저장 (신고 새로 생성)
            report = FireReportEntity.builder()
                .reportToken(token)
                .lat(request.getLat())
                .lng(request.getLng())
                .address(request.getAddress())
                .status(FireReportStatus.valueOf(request.getStatus().toUpperCase()))
                .reportedAt(request.getReportedAt())
                .dispatchedAt(request.getDispatchedAt())
                .resolvedAt(request.getResolvedAt())
                .build();
        } else {
            // 기존 신고 수정
            report.setLat(request.getLat());
            report.setLng(request.getLng());
            report.setAddress(request.getAddress());
            report.setStatus(FireReportStatus.valueOf(request.getStatus().toUpperCase()));
            report.setReportedAt(request.getReportedAt());
            report.setDispatchedAt(request.getDispatchedAt());
            report.setResolvedAt(request.getResolvedAt());
        }

        System.out.println("💾 저장 직전: " + report);
        // FireReportEntity saved = reportRepository.save(report);

        // return new FireReportDto(
        //     saved.getId(),
        //     null,
        //     saved.getLat(),
        //     saved.getLng(),
        //     saved.getAddress(),
        //     saved.getStatus(), // String → enum 으로 잘 바뀜
        //     saved.getReportedAt(),
        //     saved.getDispatchedAt(),
        //     saved.getResolvedAt()
        // );

        try {
            FireReportEntity saved = reportRepository.save(report);
            System.out.println("✅ 저장 완료: " + saved.getId());
            return new FireReportDto(
                saved.getId(),
                null,
                saved.getLat(),
                saved.getLng(),
                saved.getAddress(),
                saved.getStatus(), // String → enum 으로 잘 바뀜
                saved.getReportedAt(),
                saved.getDispatchedAt(),
                saved.getResolvedAt()
            );
        } catch (Exception e) {
            System.out.println("❌ 저장 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            throw e; // 다시 던지기
        }
    }


    public List<FireReportDto> getAllReports() {
        return reportRepository.findAll().stream().map(report -> new FireReportDto(
            report.getId(),
            null, // reportedId
            report.getLat(),
            report.getLng(),
            report.getAddress(),
            report.getStatus(), // FireReportStatus 그대로 넘김
            report.getReportedAt(),
            report.getDispatchedAt(),
            report.getResolvedAt()
        )).toList();
    }
}
