package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import com.firemap.backend.dto.ReportDto;
import com.firemap.backend.entity.ReportEntity;
import com.firemap.backend.repository.ReportRepository;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public void saveReport(ReportDto dto) {
        // ISO 8601 String → LocalDateTime 변환
        LocalDateTime timestamp = OffsetDateTime.parse(dto.getTimestamp()).toLocalDateTime();

        ReportEntity entity = new ReportEntity(
            dto.getReporterLatitude(),
            dto.getReporterLongitude(),
            dto.getFireLatitude(),
            dto.getFireLongitude(),
            timestamp
        );

        reportRepository.save(entity);
    }
}
