package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.firemap.backend.dto.HydrantDto;
import com.firemap.backend.entity.HydrantEntity;
import com.firemap.backend.repository.HydrantRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HydrantService {

    private final HydrantRepository hydrantRepository;

    public HydrantService(HydrantRepository hydrantRepository) {
        this.hydrantRepository = hydrantRepository;
    }

    @Transactional
    public HydrantDto saveHydrant(HydrantDto dto) {
        HydrantEntity entity = HydrantEntity.builder()
                .lat(dto.getLat())
                .lng(dto.getLng())
                // .address(dto.getAddress())
                .usable(dto.isUsable())
                .build();

        HydrantEntity saved = hydrantRepository.save(entity);
        dto.setId(saved.getId());
        return dto;
    }

    public List<HydrantDto> getAllHydrants() {
        return hydrantRepository.findAll().stream()
                .map(entity -> new HydrantDto(
                        entity.getId(),
                        entity.getLat(),
                        entity.getLng(),
                        // entity.getAddress(),
                        entity.isUsable()
                ))
                .collect(Collectors.toList());
    }
}
