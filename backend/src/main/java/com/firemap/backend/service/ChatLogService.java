package com.firemap.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.firemap.backend.dto.ChatLogDto;
import com.firemap.backend.entity.ChatLogEntity;
import com.firemap.backend.entity.UserEntity;
import com.firemap.backend.repository.ChatLogRepository;
import com.firemap.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatLogService {

    private final ChatLogRepository chatLogRepository;
    private final UserRepository userRepository;

    public ChatLogService(ChatLogRepository chatLogRepository, UserRepository userRepository) {
        this.chatLogRepository = chatLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatLogDto saveChatLog(ChatLogDto dto) {
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatLogEntity entity = ChatLogEntity.builder()
                .user(user)
                .message(dto.getMessage())
                .sender(dto.getSender())
                .createdAt(dto.getCreatedAt())
                .build();

        ChatLogEntity saved = chatLogRepository.save(entity);
        dto.setId(saved.getId());
        return dto;
    }

    public List<ChatLogDto> getAllChatLogs() {
        return chatLogRepository.findAll().stream()
                .map(entity -> new ChatLogDto(
                        entity.getId(),
                        entity.getUser().getId(),
                        entity.getMessage(),
                        entity.getSender(),
                        entity.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
