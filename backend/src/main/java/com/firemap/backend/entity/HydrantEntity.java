package com.firemap.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hydrants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HydrantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double lat;

    @Column(nullable = false)
    private double lng;

    // @Column(columnDefinition = "TEXT")
    // private String address;

    @Column(nullable = false)
    private boolean usable;
}
