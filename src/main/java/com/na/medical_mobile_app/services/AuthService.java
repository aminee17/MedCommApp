package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.AdminRegistrationRequest;
import com.na.medical_mobile_app.DTOs.LoginRequest;
import com.na.medical_mobile_app.DTOs.LoginResponse;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.UserRepository;
import com.na.medical_mobile_app.security.JwtTokenUtil;
import com.na.medical_mobile_app.security.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private DoctorHelperService doctorHelperService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;


    public ResponseEntity<?> login(LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        try {
            User user = userRepository.findByEmail(loginRequest.getEmail());
            if (user == null) {
                logger.warn("User not found with email: {}", loginRequest.getEmail());
                return ResponseEntity.status(401).body("Aucun utilisateur n'est enregistré avec cette adresse mail");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                logger.warn("Invalid password for email: {}", loginRequest.getEmail());
                return ResponseEntity.status(401).body("Email ou mot de passe invalide");
            }

            // Generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtTokenUtil.generateToken(userDetails);

            LoginResponse response = new LoginResponse(
                    "Connexion réussie",
                    user.getUserId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    token
            );

            logger.info("Login successful for user: {}", user.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error during login for email {}: ", loginRequest.getEmail(), e);
            return ResponseEntity.status(500).body("Erreur lors de la connexion: " + e.getMessage());
        }
    }

    public ResponseEntity<?> registerAdmin(AdminRegistrationRequest request) {
        logger.info("Starting admin registration for email: {}", request.email);
        
        try {
            // Check if email already exists
            User existingByEmail = userRepository.findByEmail(request.email);
            if (existingByEmail != null) {
                logger.warn("Email already exists: {}", request.email);
                return ResponseEntity.badRequest().body("Un compte existe déjà avec cette adresse email.");
            }

            // Check if CIN already exists
            User existingByCin = userRepository.findByCin(request.cin);
            if (existingByCin != null) {
                logger.warn("CIN already exists: {}", request.cin);
                return ResponseEntity.badRequest().body("Un compte existe déjà avec ce CIN.");
            }

            logger.info("Creating new admin user...");
            
            // Create new admin user
            User newAdmin = new User();
            newAdmin.setCin(request.cin);
            newAdmin.setName(request.name);
            newAdmin.setEmail(request.email);
            newAdmin.setPassword(passwordEncoder.encode(request.password));
            newAdmin.setPhone(request.phone);
            newAdmin.setIsActive(true);
            newAdmin.setRole(Role.ADMIN);
            newAdmin.setEmailVerifiedAt(null);
            
            logger.info("Setting location - Governorate ID: {}, City ID: {}", 
                        request.getGovernorate_id(), request.getCity_id());
            doctorHelperService.setLocation(newAdmin, request.getGovernorate_id(), request.getCity_id());
            
            newAdmin.setCreatedAt(LocalDateTime.now());
            
            logger.info("Saving admin user to database...");
            userRepository.save(newAdmin);
            
            logger.info("Admin registration successful for: {}", request.email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Compte admin créé avec succès.");
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Validation error during admin registration: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error during admin registration: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la création du compte: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
