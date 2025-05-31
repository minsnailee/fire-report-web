package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double reporterLatitude;
    private double reporterLongitude;
    private double fireLatitude;
    private double fireLongitude;

    private LocalDateTime timestamp;
}
