package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody DoctorCreationRequest request) {
        // 💌 Envoi de l'email avec le mot de passe se fait à partir du front
        return adminService.createDoctor(request);
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingRequests() {
        return adminService.getPendingRequests();
    }

    @DeleteMapping("/reject-request/{id}")
    public ResponseEntity<?> rejectDoctorRequest(@PathVariable Integer id) {
        return adminService.rejectDoctorRequest(id);
    }
}

