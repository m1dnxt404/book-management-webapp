package com.example.bookcrud.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookcrud.dto.AuthResponse;
import com.example.bookcrud.dto.LoginRequest;
import com.example.bookcrud.dto.RefreshRequest;
import com.example.bookcrud.dto.RegisterRequest;
import com.example.bookcrud.model.RefreshToken;
import com.example.bookcrud.security.JwtUtil;
import com.example.bookcrud.service.RefreshTokenService;
import com.example.bookcrud.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(JwtUtil jwtUtil, UserService userService, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return userService.authenticate(request.getUsername(), request.getPassword())
                .map(user -> {
                    String accessToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
                    RefreshToken refreshToken = refreshTokenService.createToken(user);
                    return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken.getToken()));
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request.getUsername(), request.getPassword());
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        try {
            RefreshToken old = refreshTokenService.validateToken(request.getRefreshToken());
            var user = old.getUser();
            refreshTokenService.deleteByUser(user);
            RefreshToken newRefresh = refreshTokenService.createToken(user);
            String newAccess = jwtUtil.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(newAccess, newRefresh.getToken()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
        try {
            RefreshToken rt = refreshTokenService.validateToken(request.getRefreshToken());
            refreshTokenService.deleteByUser(rt.getUser());
        } catch (RuntimeException ignored) {
            // token already expired or invalid — still succeed silently
        }
        return ResponseEntity.ok().build();
    }
}
