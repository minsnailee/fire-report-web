package com.firemap.backend.service;

import com.firemap.backend.dto.FireStationDto;
import com.firemap.backend.entity.FireDispatchEntity;
import com.firemap.backend.entity.FireStationEntity;
import com.firemap.backend.enums.FireReportStatus;
import com.firemap.backend.repository.FireStationRepository;
import lombok.RequiredArgsConstructor;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FireStationService {

    private final FireStationRepository fireStationRepository;

    public List<FireStationEntity> getAllStations() {
        return fireStationRepository.findAll();
    }

    public FireStationEntity getStationById(Long id) {
        return fireStationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 ID의 소방서를 찾을 수 없습니다."));
    }

    public List<FireStationDto> getAllStationsWithStatus() {
        return fireStationRepository.findAll().stream()
                .map(this::toDtoWithStatus)
                .collect(Collectors.toList());
    }

    // 특정 신고 기준으로 소방서 상태 + 출동 가능 여부 반환
    public List<FireStationDto> getStationsWithStatus(Long reportId) {
        return fireStationRepository.findAll().stream()
                .map(station -> toDtoWithStatus(station, reportId))
                .collect(Collectors.toList());
    }

    // 특정 신고 기준으로 DTO 구성
    private FireStationDto toDtoWithStatus(FireStationEntity entity, Long reportId) {
        return FireStationDto.builder()
                .id(entity.getId())
                .centerName(entity.getCenterName())
                .address(entity.getAddress())
                .phoneNumber(entity.getPhone())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .status(resolveStatusForThisReport(entity.getDispatches(), reportId))
                .dispatchAvailable(isDispatchAvailable(entity.getDispatches(), reportId))
                .build();
    }

    // 현재 보고 있는 신고에 대해 출동했는지 상태 반환
    private FireReportStatus resolveStatusForThisReport(List<FireDispatchEntity> dispatches, Long reportId) {
        return dispatches.stream()
                .filter(d -> d.getFireReport() != null && d.getFireReport().getId().equals(reportId))
                .map(FireDispatchEntity::getStatus)
                .findFirst()
                .orElse(null);
    }

    // 이 소방서가 다른 신고에 출동 중인지 여부 판단
    private boolean isDispatchAvailable(List<FireDispatchEntity> dispatches, Long reportId) {
        return dispatches.stream()
                .filter(d -> d.getFireReport() != null)
                .filter(d -> !d.getFireReport().getId().equals(reportId)) // 다른 신고만
                .noneMatch(d -> d.getStatus() != null && d.getStatus() != FireReportStatus.RECEIVED);
    }

    // public enum FireReportStatus {
    // RECEIVED,         // 접수
    // DISPATCHED,       // 출동
    // ARRIVED,          // 도착
    // INITIAL_SUPPRESSION, // 초진
    // OVERHAUL,         // 잔불정리
    // FULLY_SUPPRESSED, // 완진
    // WITHDRAWN,        // 철수
    // MONITORING;        // 잔불감시

    private FireStationDto toDtoWithStatus(FireStationEntity entity) {
        return FireStationDto.builder()
                .id(entity.getId())
                .centerName(entity.getCenterName())
                .address(entity.getAddress())
                .phoneNumber(entity.getPhone())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .status(resolveLatestReportStatus(entity.getDispatches()))
                .dispatchAvailable(isDispatchAvailable(entity.getDispatches()))
                .build();
    }

    private FireReportStatus resolveLatestReportStatus(List<FireDispatchEntity> dispatches) {
        Optional<FireDispatchEntity> latestDispatchOpt = dispatches.stream()
                .filter(d -> d.getFireReport() != null && d.getFireReport().getStatus() != null)
                .max(Comparator.comparing(FireDispatchEntity::getDispatchedAt));

        if (latestDispatchOpt.isPresent()) {
            FireDispatchEntity latest = latestDispatchOpt.get();
            FireReportStatus status = latest.getFireReport().getStatus();
            return status;
        }

        return null;
    }

    private boolean isDispatchAvailable(List<FireDispatchEntity> dispatches) {
        Optional<FireDispatchEntity> latestDispatchOpt = dispatches.stream()
                .filter(d -> d.getFireReport() != null)
                .max(Comparator.comparing(FireDispatchEntity::getDispatchedAt));

        if (latestDispatchOpt.isPresent()) {
            FireReportStatus status = latestDispatchOpt.get().getFireReport().getStatus();
            return status == null;
        }

        return true;
    }
}
