package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.services.MedicalFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical-forms")
@CrossOrigin(origins = "*") // Enable CORS for frontend integration
public class MedicalFormController {

    @Autowired
    private MedicalFormService medicalFormService;

    /**
     * Endpoint to save a new medical form submission
     * @param request The medical form data
     * @return The ID of the saved form
     */
    @PostMapping("/submit")
    public ResponseEntity<Integer> submitMedicalForm(@RequestBody MedicalFormRequest request) {
        try {
            Integer formId = medicalFormService.saveMedicalForm(request);
            return ResponseEntity.ok(formId);
        } catch (Exception e) {
            // Log the error and return a 500 status code
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}