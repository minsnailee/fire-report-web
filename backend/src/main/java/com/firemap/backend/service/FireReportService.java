package com.firemap.backend.service;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import com.firemap.backend.entity.*;
import com.firemap.backend.enums.FireReportStatus;
import com.firemap.backend.repository.*;


import jakarta.transaction.Transactional;

import com.firemap.backend.dto.*;

// @Service
// @Transactional
// public class FireReportService {

//     private final FireReportRepository reportRepository;
//     private final FireReportTokenRepository tokenRepository;

//     public FireReportService(FireReportRepository reportRepository, FireReportTokenRepository tokenRepository) {
//         this.reportRepository = reportRepository;
//         this.tokenRepository = tokenRepository;
//     }

//     public FireReportDto saveReport(FireReportRequest request) {
//         FireReportTokenEntity token = tokenRepository.findByToken(request.getReportedId())
//             .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

//         // 토큰으로 기존 신고가 있는지 확인
//         FireReportEntity report = reportRepository.findByReportToken(token).orElse(null);

//         if (report == null) {
//             // 최초 저장 (신고 새로 생성)
//             report = FireReportEntity.builder()
//                 .reportToken(token)
//                 .reporterLat(request.getReporterLat())
//                 .reporterLng(request.getReporterLng())
//                 .fireLat(request.getFireLat())
//                 .fireLng(request.getFireLng())
//                 .reporterAddress(request.getReporterAddress())
//                 .fireAddress(request.getFireAddress())
//                 .status(FireReportStatus.valueOf(request.getStatus().toUpperCase()))
//                 .reportedAt(request.getReportedAt())
//                 .dispatchedAt(request.getDispatchedAt())
//                 .resolvedAt(request.getResolvedAt())
//                 .build();
//         } else {
//             report.setReporterLat(request.getReporterLat());
//             report.setReporterLng(request.getReporterLng());
//             report.setFireLat(request.getFireLat());
//             report.setFireLng(request.getFireLng());
//             report.setReporterAddress(request.getReporterAddress());
//             report.setFireAddress(request.getFireAddress());
//             report.setStatus(FireReportStatus.valueOf(request.getStatus().toUpperCase()));
//             report.setReportedAt(request.getReportedAt());
//             report.setDispatchedAt(request.getDispatchedAt());
//             report.setResolvedAt(request.getResolvedAt());
//         }

//         System.out.println("저장 직전: " + report);

//         try {
//             FireReportEntity saved = reportRepository.save(report);
//             System.out.println("저장 완료: " + saved.getId());
//             return new FireReportDto(
//                 saved.getId(),
//                 token.getId(),
//                 token.getToken(),
//                 saved.getReporterLat(),
//                 saved.getReporterLng(),
//                 saved.getFireLat(),
//                 saved.getFireLng(),
//                 saved.getReporterAddress(),
//                 saved.getFireAddress(),
//                 saved.getStatus(), // String → enum 으로 잘 바뀜
//                 saved.getReportedAt(),
//                 saved.getDispatchedAt(),
//                 saved.getResolvedAt()
//             );
//         } catch (Exception e) {
//             System.out.println("저장 중 예외 발생: " + e.getMessage());
//             e.printStackTrace();
//             throw e; // 다시 던지기
//         }
//     }

//     public List<FireReportDto> getAllFireReports() {
//         return reportRepository.findAll().stream().map(report -> {
//             FireReportTokenEntity token = report.getReportToken();
//             return new FireReportDto(
//                 report.getId(),
//                 token.getId(),
//                 token.getToken(),
//                 report.getReporterLat(),
//                 report.getReporterLng(),
//                 report.getFireLat(),
//                 report.getFireLng(),
//                 report.getReporterAddress(),
//                 report.getFireAddress(),
//                 report.getStatus(),
//                 report.getReportedAt(),
//                 report.getDispatchedAt(),
//                 report.getResolvedAt()
//             );
//         }).toList();
//     }

//     public FireReportEntity dispatchReport(Long id) {
//         FireReportEntity report = reportRepository.findById(id)
//             .orElseThrow(() -> new IllegalArgumentException("신고 ID " + id + " 를 찾을 수 없습니다."));

//         // 상태를 DISPATCHED로 설정하고 출동 시간 기록
//         report.setStatus(FireReportStatus.DISPATCHED);
//         report.setDispatchedAt(java.time.LocalDateTime.now());

//         return reportRepository.save(report);
//     }

//     // 토큰 문자열로 FireReportDto 조회
//     public FireReportDto getReportByToken(String token) {
//         FireReportEntity report = reportRepository.findByReportToken_Token(token)
//             .orElseThrow(() -> new IllegalArgumentException("토큰에 해당하는 신고를 찾을 수 없습니다."));
//         FireReportTokenEntity tokenEntity = report.getReportToken();

//         return new FireReportDto(
//             report.getId(),
//             tokenEntity.getId(),
//             tokenEntity.getToken(),
//             report.getReporterLat(),
//             report.getReporterLng(),
//             report.getFireLat(),
//             report.getFireLng(),
//             report.getReporterAddress(),
//             report.getFireAddress(),
//             report.getStatus(),
//             report.getReportedAt(),
//             report.getDispatchedAt(),
//             report.getResolvedAt()
//         );
//     }
// }



@Service
@Transactional
public class FireReportService {

    private final FireReportRepository reportRepository;
    private final FireReportTokenRepository tokenRepository;

    public FireReportService(FireReportRepository reportRepository, FireReportTokenRepository tokenRepository) {
        this.reportRepository = reportRepository;
        this.tokenRepository = tokenRepository;
    }

    // 신고 접수 및 수정
    public FireReportDto saveReport(FireReportRequest request) {
        // 토큰 엔티티 조회 (토큰 문자열로 찾음)
        FireReportTokenEntity token = tokenRepository.findByToken(request.getReportedId())
            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        // 기존 신고 조회
        FireReportEntity report = reportRepository.findByReportToken(token).orElse(null);

        if (report == null) {
            // 신규 신고 생성
            report = FireReportEntity.builder()
                .reportToken(token)
                .reporterLat(request.getReporterLat())
                .reporterLng(request.getReporterLng())
                .fireLat(request.getFireLat())
                .fireLng(request.getFireLng())
                .reporterAddress(request.getReporterAddress())
                .fireAddress(request.getFireAddress())
                .reportedAt(request.getReportedAt())
                .build();
        } else {
            // 기존 신고 업데이트 (상태, 출동 관련 필드는 제외)
            report.setReporterLat(request.getReporterLat());
            report.setReporterLng(request.getReporterLng());
            report.setFireLat(request.getFireLat());
            report.setFireLng(request.getFireLng());
            report.setReporterAddress(request.getReporterAddress());
            report.setFireAddress(request.getFireAddress());
            report.setReportedAt(request.getReportedAt());
        }

        FireReportEntity saved = reportRepository.save(report);

        return new FireReportDto(
            saved.getId(),
            token.getId(),
            token.getToken(),
            saved.getReporterLat(),
            saved.getReporterLng(),
            saved.getFireLat(),
            saved.getFireLng(),
            saved.getReporterAddress(),
            saved.getFireAddress(),
            saved.getReportedAt()
        );
    }

    // 모든 신고 조회
    public List<FireReportDto> getAllFireReports() {
        return reportRepository.findAll().stream().map(report -> {
            FireReportTokenEntity token = report.getReportToken();
            return new FireReportDto(
                report.getId(),
                token.getId(),
                token.getToken(),
                report.getReporterLat(),
                report.getReporterLng(),
                report.getFireLat(),
                report.getFireLng(),
                report.getReporterAddress(),
                report.getFireAddress(),
                report.getReportedAt()
            );
        }).toList();
    }

    // 토큰으로 신고 조회
    public FireReportDto getReportByToken(String tokenStr) {
        FireReportEntity report = reportRepository.findByReportToken_Token(tokenStr)
            .orElseThrow(() -> new IllegalArgumentException("토큰에 해당하는 신고를 찾을 수 없습니다."));
        FireReportTokenEntity token = report.getReportToken();

        return new FireReportDto(
            report.getId(),
            token.getId(),
            token.getToken(),
            report.getReporterLat(),
            report.getReporterLng(),
            report.getFireLat(),
            report.getFireLng(),
            report.getReporterAddress(),
            report.getFireAddress(),
            report.getReportedAt()
        );
    }

}
