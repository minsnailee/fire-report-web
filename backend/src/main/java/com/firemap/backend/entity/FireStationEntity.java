package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fire_stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FireStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sidoHeadquarter; // 시도본부

    private String centerName; // 119안전센터명

    private String address; // 주소

    private String phone; // 전화번호

    private String fax; // 팩스번호

    private double latitude; // 위도

    private double longitude; // 경도
}