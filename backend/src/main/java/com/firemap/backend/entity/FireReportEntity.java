package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.firemap.backend.enums.FireReportStatus;  
@Entity
@Table(name = "fire_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FireReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신고자 (users.id)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "reporter_id", nullable = false)
    // private UserEntity reporter;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_token_id", nullable = false)
    private FireReportTokenEntity reportToken;

    // @Column(nullable = false)
    // private double lat;

    // @Column(nullable = false)
    // private double lng;

    // @Column(columnDefinition = "TEXT", nullable = false)
    // private String address;
    @Column(nullable = false)
    private double reporterLat;

    @Column(nullable = false)
    private double reporterLng;

    @Column(nullable = false)
    private double fireLat;

    @Column(nullable = false)
    private double fireLng;

    @Column(name = "reporter_address", columnDefinition = "TEXT", nullable = false)
    private String reporterAddress; // 신고자 현재 위치 주소

    @Column(name = "fire_address", columnDefinition = "TEXT", nullable = false)
    private String fireAddress; // 화재 발생 위치 주소

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FireReportStatus status;  // 내부 enum 대신 외부 enum 사용

    @Column(name = "reported_at", nullable = false)
    private LocalDateTime reportedAt;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // public enum Status {
    //     REPORTED, DISPATCHED, RESOLVED
    // }
}
