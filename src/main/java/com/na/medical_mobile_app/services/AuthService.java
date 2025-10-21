package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.LoginRequest;
import com.na.medical_mobile_app.DTOs.AdminRegistrationRequest;

import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.UserRepository;
import com.na.medical_mobile_app.security.JwtTokenUtil;
import com.na.medical_mobile_app.security.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // Load user details
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            
            // Get the actual user entity to get ID and role
            User user = userRepository.findByEmail(loginRequest.getEmail());
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Generate token with user ID and role
            final String token = jwtTokenUtil.generateToken(userDetails, user.getId(), user.getRole().name());

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("userRole", user.getRole().name());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);

        } catch (DisabledException e) {
            return ResponseEntity.badRequest().body("USER_DISABLED");
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("INVALID_CREDENTIALS");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    public ResponseEntity<?> registerAdmin(AdminRegistrationRequest request) {
        try {

            // Check if user already exists
            if (userRepository.findByEmail(request.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Email already registered");
            }

            // Create new admin user
            User adminUser = new User();
            adminUser.setEmail(request.getEmail());
            adminUser.setPassword(passwordEncoder.encode(request.getPassword()));
            adminUser.setFullName(request.getFullName());
            adminUser.setRole(com.na.medical_mobile_app.entities.Role.ADMIN);
            adminUser.setIsActive(true);

            // Save user
            User savedUser = userRepository.save(adminUser);

            // Generate token for immediate login
            final UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
            final String token = jwtTokenUtil.generateToken(userDetails, savedUser.getId(), savedUser.getRole().name());

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", savedUser.getId());
            response.put("userRole", savedUser.getRole().name());
            response.put("email", savedUser.getEmail());
            response.put("fullName", savedUser.getFullName());
            response.put("message", "Admin registration successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
