package com.firemap.backend.controller;

import com.firemap.backend.entity.FireStationEntity;
import com.firemap.backend.service.FireStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fire-stations")
@RequiredArgsConstructor
public class FireStationController {

    private final FireStationService fireStationService;

    // 소방서 위치 정보
    @GetMapping
    public List<FireStationEntity> getAllStations() {
        return fireStationService.getAllStations();
    }

    // 특정 ID로 소방서 하나 조회
    @GetMapping("/{id}")
    public FireStationEntity getStationById(@PathVariable Long id) {
        return fireStationService.getStationById(id);
    }
}
