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

    @GetMapping
    public List<FireStationEntity> getAllStations() {
        return fireStationService.getAllStations();
    }
}
