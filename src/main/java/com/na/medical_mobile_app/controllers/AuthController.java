package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.LoginRequest;
import com.na.medical_mobile_app.DTOs.AdminRegistrationRequest;
import com.na.medical_mobile_app.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "*")
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


}