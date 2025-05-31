package com.firemap.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firemap.backend.dto.ReportDto;
import com.firemap.backend.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // POST: 신고 저장
    @PostMapping
    public ResponseEntity<String> receiveReport(@RequestBody ReportDto report) {
        System.out.println("🚨 화재 신고 수신:");
        System.out.println("신고자 위치: " + report.getReporterLatitude() + ", " + report.getReporterLongitude());
        System.out.println("화재 위치: " + report.getFireLatitude() + ", " + report.getFireLongitude());
        System.out.println("신고 시각: " + report.getTimestamp());

        reportService.saveReport(report);

        return ResponseEntity.ok("신고 접수 및 저장 완료");
    }

    // GET: 신고 내역 전체 조회
    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        List<ReportDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }
}
