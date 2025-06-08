package com.firemap.backend.service;

import com.firemap.backend.entity.FireStationEntity;
import com.firemap.backend.repository.FireStationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FireStationService {

    private final FireStationRepository fireStationRepository;

    public List<FireStationEntity> getAllStations() {
        return fireStationRepository.findAll();
    }
}
