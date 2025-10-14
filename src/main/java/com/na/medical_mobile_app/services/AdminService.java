package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.DTOs.DoctorResponseDTO;
import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import com.na.medical_mobile_app.repositories.UserRepository;
import com.na.medical_mobile_app.security.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private GovernorateRepository governorateRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private DoctorHelperService doctorHelperService;


//-----------------------------------Creating a doctor--------------------------------------------------------------------
public ResponseEntity<?> createDoctor(DoctorCreationRequest request) {
    try {
        System.out.println("🩺 Processing doctor creation for: " + request.getEmail());
        System.out.println("📋 Request details - Name: " + request.getName() + ", Role: " + request.getRole());
        
        User existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser != null) {
            if (existingUser.getIsActive()) {
                System.out.println("❌ Email already in use: " + request.getEmail());
                return ResponseEntity.badRequest().body("Email déjà utilisé");
            }

            // Reactivate inactive doctor
            String rawPassword = PasswordGenerator.generateSecurePassword();
            String hashedPassword = passwordEncoder.encode(rawPassword);

            doctorHelperService.populateDoctorFields(existingUser, request);
            existingUser.setPassword(hashedPassword);
            existingUser.setIsActive(true);
            existingUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(existingUser);

            DoctorResponseDTO responseDTO = new DoctorResponseDTO(
                    existingUser.getName(),
                    existingUser.getEmail(),
                    rawPassword
            );
            
            System.out.println("✅ Reactivated doctor: " + existingUser.getEmail());
            return ResponseEntity.ok(Map.of("doctor", responseDTO));
        }

        // Create new doctor
        String rawPassword = PasswordGenerator.generateSecurePassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User doctor = new User();
        doctor.setEmail(request.getEmail());
        doctorHelperService.populateDoctorFields(doctor, request);
        doctor.setPassword(hashedPassword);
        doctor.setIsActive(true);
        doctor.setCreatedAt(LocalDateTime.now());
        userRepository.save(doctor);

        DoctorResponseDTO responseDTO = new DoctorResponseDTO(
                doctor.getName(),
                doctor.getEmail(),
                rawPassword
        );

        System.out.println("✅ Created new doctor: " + doctor.getEmail());
        return ResponseEntity.ok(Map.of("doctor", responseDTO));

    } catch (Exception e) {
        System.out.println("❌ Error in createDoctor service: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.internalServerError().body("Error creating doctor: " + e.getMessage());
    }
}


    //-------------------------------Get pending requests-------------------------------------------------------------------------
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<Role> medicalRoles = List.of(Role.MEDECIN, Role.NEUROLOGUE, Role.NEUROLOGUE_RESIDENT);
            List<User> demandes = userRepository.findPendingRequestsByRoles(medicalRoles);
        
            System.out.println("📊 Found " + demandes.size() + " pending doctor requests");
        
            // Debug: Print each pending request
            for (User user : demandes) {
                System.out.println("🩺 Pending: " + user.getName() + " - " + user.getEmail() + 
                                 " - Role: " + user.getRole() + " - Active: " + user.getIsActive());
            }
        
            if (demandes.isEmpty()) {
                return ResponseEntity.ok().body("No pending requests");
            }
        
            return ResponseEntity.ok(demandes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching pending requests: " + e.getMessage());
        }
    }
//--------------------------------------------Reject a doctor---------------------------------------------------------------
    public ResponseEntity<?> rejectDoctorRequest(Integer id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null)
        {
            return ResponseEntity.badRequest().body("Aucune demande trouvée .");
        }
        if (Boolean.TRUE.equals(user.getIsActive()))
        {
            return ResponseEntity.badRequest().body("demande déjà activée.");
        }

        userRepository.delete(user);
        return ResponseEntity.ok("Demande de création de compte supprimée avec succès.");
    }
}
