package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.firemap.backend.dto.DispatchLogDto;
import com.firemap.backend.entity.DispatchLogEntity;
import com.firemap.backend.entity.FireReportEntity;
import com.firemap.backend.entity.UserEntity;
import com.firemap.backend.repository.DispatchLogRepository;
import com.firemap.backend.repository.FireReportRepository;
import com.firemap.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispatchLogService {

    private final DispatchLogRepository dispatchLogRepository;
    private final FireReportRepository fireReportRepository;
    private final UserRepository userRepository;

    public DispatchLogService(DispatchLogRepository dispatchLogRepository,
                              FireReportRepository fireReportRepository,
                              UserRepository userRepository) {
        this.dispatchLogRepository = dispatchLogRepository;
        this.fireReportRepository = fireReportRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DispatchLogDto saveDispatchLog(DispatchLogDto dto) {
        FireReportEntity fireReport = fireReportRepository.findById(dto.getFireReportId())
                .orElseThrow(() -> new RuntimeException("FireReport not found"));
        UserEntity firefighter = userRepository.findById(dto.getFirefighterId())
                .orElseThrow(() -> new RuntimeException("Firefighter not found"));

        DispatchLogEntity entity = DispatchLogEntity.builder()
                .fireReport(fireReport)
                .firefighter(firefighter)
                .dispatchedAt(dto.getDispatchedAt())
                .status(dto.getStatus())
                .build();

        DispatchLogEntity saved = dispatchLogRepository.save(entity);
        dto.setId(saved.getId());
        return dto;
    }

    public List<DispatchLogDto> getAllDispatchLogs() {
        return dispatchLogRepository.findAll().stream()
                .map(entity -> new DispatchLogDto(
                        entity.getId(),
                        entity.getFireReport().getId(),
                        entity.getFirefighter().getId(),
                        entity.getDispatchedAt(),
                        entity.getStatus()
                ))
                .collect(Collectors.toList());
    }
}
