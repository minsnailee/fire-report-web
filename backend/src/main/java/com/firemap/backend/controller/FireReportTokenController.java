package com.firemap.backend.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firemap.backend.entity.FireReportTokenEntity;
import com.firemap.backend.service.FireReportTokenService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fire-report-tokens")
public class FireReportTokenController {

    private final FireReportTokenService tokenService;

    public FireReportTokenController(FireReportTokenService tokenService) {
        this.tokenService = tokenService;
    }

    // 토큰 생성 API (관제센터에서 URL 생성할 때 호출)
    @PostMapping("/create")
    public ResponseEntity<String> createToken() {
        FireReportTokenEntity token = tokenService.createToken();
        return ResponseEntity.ok(token.getToken());
    }

    // 토큰 검증 API (신고자가 URL 접속 시 토큰 검증용)
    @GetMapping("/validate/{token}")
    public ResponseEntity<Boolean> validateToken(@PathVariable String token) {
        boolean valid = tokenService.isValidToken(token);
        return ResponseEntity.ok(valid);
    }
}
