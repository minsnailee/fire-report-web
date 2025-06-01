package com.firemap.backend.dto;

import com.firemap.backend.entity.ChatLogEntity.Sender;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatLogDto {
    private Long id;
    private Long userId;
    private String message;
    private Sender sender;
    private LocalDateTime createdAt;
}
