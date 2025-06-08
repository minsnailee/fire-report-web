// package com.firemap.backend.controller;

// import org.springframework.web.bind.annotation.*;
// import com.firemap.backend.dto.DispatchLogDto;
// import com.firemap.backend.service.DispatchLogService;

// import java.util.List;

// @RestController
// @RequestMapping("/dispatch-logs")
// public class DispatchLogController {

//     private final DispatchLogService dispatchLogService;

//     public DispatchLogController(DispatchLogService dispatchLogService) {
//         this.dispatchLogService = dispatchLogService;
//     }

//     // 출동 기록 생성
//     @PostMapping
//     public DispatchLogDto createDispatchLog(@RequestBody DispatchLogDto dto) {
//         return dispatchLogService.saveDispatchLog(dto);
//     }

//     // 모든 출동 기록 조회
//     @GetMapping
//     public List<DispatchLogDto> getDispatchLogs() {
//         return dispatchLogService.getAllDispatchLogs();
//     }
// }
