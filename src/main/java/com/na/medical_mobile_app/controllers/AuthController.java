package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.LoginRequest;
import com.na.medical_mobile_app.DTOs.AdminRegistrationRequest;
import com.na.medical_mobile_app.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }
    
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminRegistrationRequest request) {
        return authService.registerAdmin(request);
    }

    // Optional: Add logout endpoint if needed
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body("Logged out successfully");
    }

    // Optional: Add token validation endpoint
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        return authService.validateToken(token);
    }
}