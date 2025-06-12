package com.firemap.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

import com.firemap.backend.enums.FireReportStatus;

// @Data
// @AllArgsConstructor
// public class FireReportDto {
//     private Long id;
//     // private Long reportedId;
//     private Long tokenId;
//     private String token;
//     private double reporterLat;
//     private double reporterLng;
//     private double fireLat;
//     private double fireLng;
//     private String reporterAddress;
//     private String fireAddress;
//     private FireReportStatus status;
//     private LocalDateTime reportedAt;
//     private LocalDateTime dispatchedAt;
//     private LocalDateTime resolvedAt;;
// }

@Data
@AllArgsConstructor
public class FireReportDto {
    private Long id;
    private Long tokenId;
    private String token;
    private double reporterLat;
    private double reporterLng;
    private double fireLat;
    private double fireLng;
    private String reporterAddress;
    private String fireAddress;
    private LocalDateTime reportedAt;
}