package com.firemap.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firemap.backend.dto.ReportDto;
import com.firemap.backend.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*") // 개발용, CORS 허용
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<String> receiveReport(@RequestBody ReportDto report) {
        System.out.println("🚨 화재 신고 수신:");
        System.out.println("신고자 위치: " + report.getReporterLatitude() + ", " + report.getReporterLongitude());
        System.out.println("화재 위치: " + report.getFireLatitude() + ", " + report.getFireLongitude());
        System.out.println("신고 시각: " + report.getTimestamp());

        reportService.saveReport(report);

        // 👉 여기서 DB 저장, 알림 발송 등의 로직을 추가할 수 있음

        return ResponseEntity.ok("신고 접수 및 저장 완료");
    }
}
