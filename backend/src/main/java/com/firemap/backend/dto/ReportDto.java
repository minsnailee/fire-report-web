package com.firemap.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
    private Long id;
    private double reporterLatitude;
    private double reporterLongitude;
    private double fireLatitude;
    private double fireLongitude;
    private String timestamp;
}
