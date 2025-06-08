package com.firemap.backend.controller;

import com.firemap.backend.dto.FireDispatchDto;
import com.firemap.backend.service.FireDispatchService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fire-dispatches")
@RequiredArgsConstructor
public class FireDispatchController {

    private final FireDispatchService fireDispatchService;

    // 출동지시 생성
    @PostMapping
    public ResponseEntity<FireDispatchDto> createDispatch(@RequestBody FireDispatchDto dto) {
        FireDispatchDto created = fireDispatchService.createDispatch(dto);
        return ResponseEntity.ok(created);
    }

    // 특정 화재신고의 출동지시 목록 조회
    @GetMapping("/report/{reportToken}")
    public ResponseEntity<List<FireDispatchDto>> getDispatchesByReport(@PathVariable String reportToken) {
        List<FireDispatchDto> list = fireDispatchService.getDispatchesByReportToken(reportToken);
        return ResponseEntity.ok(list);
    }

    // 출동 상태 업데이트
    @PutMapping("/{dispatchId}/status")
    public ResponseEntity<FireDispatchDto> updateStatus(@PathVariable Long dispatchId, @RequestParam String status) {
        FireDispatchDto updated = fireDispatchService.updateStatus(dispatchId, status);
        return ResponseEntity.ok(updated);
    }
}
