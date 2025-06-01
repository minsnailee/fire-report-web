package com.firemap.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HydrantDto {
    private Long id;
    private double lat;
    private double lng;
    // private String address;
    private boolean usable;
}
