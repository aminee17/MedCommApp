package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.AdminRegistrationRequest;
import com.na.medical_mobile_app.DTOs.LoginRequest;
import com.na.medical_mobile_app.DTOs.LoginResponse;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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


    public ResponseEntity<?> login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(401).body("Aucun utilisateur n'est enregistré avec cette adresse mail");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Email ou mot de passe invalide");
        }

        LoginResponse response = new LoginResponse(
                "Connexion réussie",
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        // TODO : MOT DE PASSE OUBLIE FEATURE
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> registerAdmin(AdminRegistrationRequest request) {
        User existing = userRepository.findByCin(request.cin);

        if (existing == null || existing.getRole() == null || !existing.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest().body("CIN non reconnu ou non autorisé pour un compte admin.");
        }

        if (existing.getEmail() != null && !existing.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Un compte est déjà créé avec cet administrateur.");
        }

        existing.setName(request.name);
        existing.setEmail(request.email);
        existing.setPassword(passwordEncoder.encode(request.password));
        existing.setPhone(request.phone);
        existing.setIsActive(true);
        existing.setRole(Role.ADMIN);
        existing.setEmailVerifiedAt(null); // Can be modifed later this is why it is null now (a reminder)
        doctorHelperService.setLocation(existing, request.getGovernorate_id(), request.getCity_id());
        existing.setCreatedAt(LocalDateTime.now());
        userRepository.save(existing);

        return ResponseEntity.ok("Compte admin créé avec succès.");
    }
}
