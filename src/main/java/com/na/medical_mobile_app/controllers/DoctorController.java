package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/doctor")
// @CrossOrigin(origins = "*") // si tu fais appel depuis mobile/web
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/request-account")
    public ResponseEntity<?> requestAccount(@RequestBody DoctorCreationRequest request) {
        return doctorService.requestAccount(request);
    }
}
