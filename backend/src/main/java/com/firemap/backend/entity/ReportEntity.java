package com.firemap.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double reporterLatitude;
    private double reporterLongitude;
    private double fireLatitude;
    private double fireLongitude;

    private LocalDateTime timestamp;

    // 기본 생성자
    public ReportEntity() {}

    // 생성자 편의 메서드 (DTO 변환용)
    public ReportEntity(double reporterLatitude, double reporterLongitude,
                        double fireLatitude, double fireLongitude,
                        LocalDateTime timestamp) {
        this.reporterLatitude = reporterLatitude;
        this.reporterLongitude = reporterLongitude;
        this.fireLatitude = fireLatitude;
        this.fireLongitude = fireLongitude;
        this.timestamp = timestamp;
    }

    // getter / setter 생략 (IDE 자동생성 추천)
}
