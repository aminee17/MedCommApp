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

import java.time.LocalDateTime;

@Service
public class AuthService {

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
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(401).body("Aucun utilisateur n'est enregistré avec cette adresse mail");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
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

        // TODO : MOT DE PASSE OUBLIE FEATURE
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> registerAdmin(AdminRegistrationRequest request) {
        // Check if email already exists
        User existingByEmail = userRepository.findByEmail(request.email);
        if (existingByEmail != null) {
            return ResponseEntity.badRequest().body("Un compte existe déjà avec cette adresse email.");
        }

        // Check if CIN already exists
        User existingByCin = userRepository.findByCin(request.cin);
        if (existingByCin != null) {
            return ResponseEntity.badRequest().body("Un compte existe déjà avec ce CIN.");
        }

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
        doctorHelperService.setLocation(newAdmin, request.getGovernorate_id(), request.getCity_id());
        newAdmin.setCreatedAt(LocalDateTime.now());
        userRepository.save(newAdmin);

        return ResponseEntity.ok("Compte admin créé avec succès.");
    }
}
