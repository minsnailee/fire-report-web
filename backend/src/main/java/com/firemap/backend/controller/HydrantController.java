package com.firemap.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.firemap.backend.dto.HydrantDto;
import com.firemap.backend.service.HydrantService;

import java.util.List;

@RestController
@RequestMapping("/hydrants")
public class HydrantController {

    private final HydrantService hydrantService;

    public HydrantController(HydrantService hydrantService) {
        this.hydrantService = hydrantService;
    }

    @PostMapping
    public HydrantDto createHydrant(@RequestBody HydrantDto dto) {
        return hydrantService.saveHydrant(dto);
    }

    @GetMapping
    public List<HydrantDto> getHydrants() {
        return hydrantService.getAllHydrants();
    }
}
