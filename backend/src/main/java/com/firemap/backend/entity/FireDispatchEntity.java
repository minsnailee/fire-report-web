package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;

/*
 * 소방서 단위 출동 관리
 */
@Entity
@Table(name = "fire_dispatches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FireDispatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신고 토큰 (UUID, PK가 아닌 참조값)
    @Column(nullable = false)
    private String reportToken;

    // 출동할 소방서 ID
    @Column(nullable = false)
    private Long fireStationId;

    @Column(nullable = false)
    private String status;
}
