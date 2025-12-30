package com.example.bookcrud.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.bookcrud.dto.LoginRequest;
import com.example.bookcrud.security.JwtUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        
        // demo credentials
        if ("admin".equals(request.getUsername()) &&
            "password".equals(request.getPassword())) {
            return jwtUtil.generateToken(request.getUsername());
        }
        throw new RuntimeException("Invalid credentials");
    }


    
}
