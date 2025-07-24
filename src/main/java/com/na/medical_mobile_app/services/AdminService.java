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
    User existingUser = userRepository.findByEmail(request.email);

    if (existingUser != null) {
        if (existingUser.getIsActive()) {
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
        return ResponseEntity.ok(Map.of("doctor", responseDTO));

    }

    // Create new doctor
    String rawPassword = PasswordGenerator.generateSecurePassword();
    String hashedPassword = passwordEncoder.encode(rawPassword);

    User doctor = new User();
    doctor.setEmail(request.email); // Needed before populating for lookup logic
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


// Return wrapped object
    return ResponseEntity.ok(Map.of("doctor", responseDTO));

}


    //-------------------------------Get pending requests-------------------------------------------------------------------------
    public ResponseEntity<?> getPendingRequests() {
        List<Role> medicalRoles = List.of(Role.MEDECIN, Role.NEUROLOGUE, Role.NEUROLOGUE_RESIDENT);
        List<User> demandes = userRepository.findPendingRequestsByRoles(medicalRoles);
        return ResponseEntity.ok(demandes);
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
