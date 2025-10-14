package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;

import com.na.medical_mobile_app.entities.User;

import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DoctorService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorHelperService doctorHelperService;

    //------------------------------------------Requesting an account creation---------------------------------------------------
    public ResponseEntity<?> requestAccount(DoctorCreationRequest request) {
        // Use getter methods
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        // Use getter methods
        if (userRepository.findByCin(request.getCin()) != null) {
            return ResponseEntity.badRequest().body("Cin déjà utilisé");
        }

        User doctorRequest = new User();
        doctorHelperService.populateDoctorFields(doctorRequest, request);
        doctorRequest.setEmail(request.getEmail()); // Use getter
        doctorRequest.setIsActive(false); // demande en attente
        doctorRequest.setCreatedAt(LocalDateTime.now());

        userRepository.save(doctorRequest);

        return ResponseEntity.ok("Demande de création de compte reçue, en attente de validation admin.");
    }
}
