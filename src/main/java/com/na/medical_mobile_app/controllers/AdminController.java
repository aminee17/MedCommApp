package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping(value = "/create-doctor", 
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createDoctor(@RequestBody DoctorCreationRequest request) {
        try {
            System.out.println("📥 Received doctor creation request: " + request.toString());
            return adminService.createDoctor(request);
        } catch (Exception e) {
            System.out.println("❌ Error creating doctor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating doctor: " + e.getMessage());
        }
    }

    @GetMapping(value = "/pending-requests", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPendingRequests() {
        try {
            return adminService.getPendingRequests();
        } catch (Exception e) {
            System.out.println("❌ Error fetching pending requests: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching pending requests: " + e.getMessage());
        }
    }

    @DeleteMapping(value = "/reject-request/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> rejectDoctorRequest(@PathVariable Integer id) {
        try {
            return adminService.rejectDoctorRequest(id);
        } catch (Exception e) {
            System.out.println("❌ Error rejecting request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error rejecting request: " + e.getMessage());
        }
    }
}