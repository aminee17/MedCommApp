package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin(origins = {"https://medcommapp-frontend.onrender.com", "http://localhost:3000", "http://localhost:19006"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody DoctorCreationRequest request) {
        try {
            return adminService.createDoctor(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating doctor: " + e.getMessage());
        }
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingRequests() {
        try {
            return adminService.getPendingRequests();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching pending requests: " + e.getMessage());
        }
    }

    @DeleteMapping("/reject-request/{id}")
    public ResponseEntity<?> rejectDoctorRequest(@PathVariable Integer id) {
        try {
            return adminService.rejectDoctorRequest(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting request: " + e.getMessage());
        }
    }
}

