package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
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
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private DoctorHelperService doctorHelperService;

//------------------------------------------Requesting an account creation---------------------------------------------------
    public ResponseEntity<?> requestAccount(DoctorCreationRequest request) {
        if (userRepository.findByEmail(request.email) != null) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        if (userRepository.findByCin(request.cin) != null) {
            return ResponseEntity.badRequest().body("Cin déjà utilisé");
        }

        User doctorRequest = new User();
        doctorHelperService.populateDoctorFields(doctorRequest, request);
        doctorRequest.setEmail(request.email);
        doctorRequest.setIsActive(false); // demande en attente
        doctorRequest.setCreatedAt(LocalDateTime.now());

        userRepository.save(doctorRequest);

        return ResponseEntity.ok("Demande de création de compte reçue, en attente de validation admin.");
    }
}
