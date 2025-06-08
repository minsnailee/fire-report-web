package com.firemap.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FireDispatchDto {
    private Long id;
    private String reportToken;     // Long fireReportId -> String reportToken 으로 변경
    private Long fireStationId;
    private String status;
}