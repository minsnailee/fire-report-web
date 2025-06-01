package com.firemap.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.firemap.backend.dto.FireReportRequest;
import com.firemap.backend.dto.FireReportDto;
import com.firemap.backend.service.FireReportService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fire-reports")
public class FireReportController {

    private final FireReportService fireReportService;

    public FireReportController(FireReportService svc) {
        this.fireReportService = svc;
    }

    @PostMapping
    public FireReportDto createReport(@RequestBody FireReportRequest request) {
        System.out.println("Request status: " + request.getStatus());
        System.out.println("Request reportedId: " + request.getReportedId());
        System.out.println("Request reportedAt: " + request.getReportedAt());
        return fireReportService.saveReport(request);
    }

    @GetMapping
    public List<FireReportDto> getReports() {
        return fireReportService.getAllReports();
    }
}
