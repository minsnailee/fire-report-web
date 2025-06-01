package com.firemap.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.firemap.backend.dto.UserDto;
import com.firemap.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService svc) {
        this.userService = svc;
    }

    @PostMapping
    public UserDto createUser(@RequestBody UserDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping
    public List<UserDto> getUsers() {
        return userService.getAllUsers();
    }
}
