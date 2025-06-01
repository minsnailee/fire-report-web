package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispatch_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DispatchLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 화재 신고 (fire_reports.id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fire_report_id", nullable = false)
    private FireReportEntity fireReport;

    // 출동 소방관 (users.id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firefighter_id", nullable = false)
    private UserEntity firefighter;

    @Column(name = "dispatched_at", nullable = false)
    private LocalDateTime dispatchedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        pending, in_progress, completed
    }
}
