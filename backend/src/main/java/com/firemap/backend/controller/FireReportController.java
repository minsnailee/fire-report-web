package com.firemap.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firemap.backend.dto.FireReportRequest;
import com.firemap.backend.dto.FireStationDto;
import com.firemap.backend.entity.FireReportEntity;
import com.firemap.backend.dto.FireReportDto;
import com.firemap.backend.service.FireReportService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.firemap.backend.service.FireStationService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fire-reports")
@RequiredArgsConstructor
public class FireReportController {

    private final FireReportService fireReportService;
    private final FireStationService fireStationService;

    // 신고 접수 (신고 생성 및 수정)
    @PostMapping
    public FireReportDto createReport(@RequestBody FireReportRequest request) {
        return fireReportService.saveReport(request);
    }

    // 모든 신고 조회
    @GetMapping
    public List<FireReportDto> getFireReports() {
        return fireReportService.getAllFireReports();
    }

    // 토큰으로 신고 조회
    @GetMapping("/by-token/{token}")
    public FireReportDto getReportByToken(@PathVariable String token) {
        return fireReportService.getReportByToken(token);
    }

    public List<FireReportDto> getReportedOnly() {
        return fireReportService.getReportedReports()
            .stream()
            .map(FireReportDto::from)
            .collect(Collectors.toList());
    }

    // 신고 기준으로 소방서 상태 조회
    @GetMapping("/{reportId}/stations-with-status")
    public ResponseEntity<List<FireStationDto>> getStationsWithStatusByReport(@PathVariable Long reportId) {
        List<FireStationDto> stations = fireStationService.getStationsWithStatus(reportId);
        return ResponseEntity.ok(stations);
    }

    // 상태 카운트
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = fireReportService.getFireReportStats();
        return ResponseEntity.ok(stats);
    }
}