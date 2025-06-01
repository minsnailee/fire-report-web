package com.firemap.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.firemap.backend.dto.ChatLogDto;
import com.firemap.backend.service.ChatLogService;

import java.util.List;

@RestController
@RequestMapping("/chat-logs")
public class ChatLogController {

    private final ChatLogService chatLogService;

    public ChatLogController(ChatLogService chatLogService) {
        this.chatLogService = chatLogService;
    }

    @PostMapping
    public ChatLogDto createChatLog(@RequestBody ChatLogDto dto) {
        return chatLogService.saveChatLog(dto);
    }

    @GetMapping
    public List<ChatLogDto> getChatLogs() {
        return chatLogService.getAllChatLogs();
    }
}
