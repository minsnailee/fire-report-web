package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import com.firemap.backend.dto.ReportDto;
import com.firemap.backend.entity.ReportEntity;
import com.firemap.backend.repository.ReportRepository;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public void saveReport(ReportDto dto) {
        LocalDateTime timestamp = OffsetDateTime.parse(dto.getTimestamp()).toLocalDateTime();

        ReportEntity entity = new ReportEntity(
            null, // ID는 자동 생성
            dto.getReporterLatitude(),
            dto.getReporterLongitude(),
            dto.getFireLatitude(),
            dto.getFireLongitude(),
            timestamp
        );

        reportRepository.save(entity);
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream()
            .map(entity -> new ReportDto(
                entity.getId(),
                entity.getReporterLatitude(),
                entity.getReporterLongitude(),
                entity.getFireLatitude(),
                entity.getFireLongitude(),
                entity.getTimestamp().toString()
            ))
            .collect(Collectors.toList());
    }
}
