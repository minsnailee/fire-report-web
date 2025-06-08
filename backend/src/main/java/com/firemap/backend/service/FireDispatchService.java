package com.firemap.backend.service;

import com.firemap.backend.dto.FireDispatchDto;
import com.firemap.backend.entity.FireDispatchEntity;
import com.firemap.backend.repository.FireDispatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FireDispatchService {

    private final FireDispatchRepository fireDispatchRepository;

    public FireDispatchDto createDispatch(FireDispatchDto dto) {
        FireDispatchEntity entity = FireDispatchEntity.builder()
                .reportToken(dto.getReportToken())
                .fireStationId(dto.getFireStationId())
                .status(dto.getStatus())
                .build();

        entity = fireDispatchRepository.save(entity);
        dto.setId(entity.getId());
        return dto;
    }

    public List<FireDispatchDto> getDispatchesByReportToken(String reportToken) {
        List<FireDispatchEntity> list = fireDispatchRepository.findByReportToken(reportToken);
        return list.stream().map(entity -> FireDispatchDto.builder()
                .id(entity.getId())
                .reportToken(entity.getReportToken())
                .fireStationId(entity.getFireStationId())
                .status(entity.getStatus())
                .build()).collect(Collectors.toList());
    }

    public FireDispatchDto updateStatus(Long dispatchId, String status) {
        FireDispatchEntity entity = fireDispatchRepository.findById(dispatchId)
                .orElseThrow(() -> new IllegalArgumentException("Dispatch not found"));
        entity.setStatus(status);
        fireDispatchRepository.save(entity);
        return FireDispatchDto.builder()
                .id(entity.getId())
                .reportToken(entity.getReportToken())
                .fireStationId(entity.getFireStationId())
                .status(entity.getStatus())
                .build();
    }
}
