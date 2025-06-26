package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.services.MedicalFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


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

    //---------------------Doctor's dashboard---------------------
    // In MedicalFormController.java
    @GetMapping("/doctor")
    public ResponseEntity<List<Map<String, Object>>> getMedicalFormsForDoctor() {
        try {
            List<MedicalForm> forms = medicalFormService.getAllMedicalForms();

            // Transform to simplified format for frontend
            List<Map<String, Object>> formData = forms.stream()
                    .map(form -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("id", form.getFormId());
                        data.put("fullName", form.getPatient().getName());
                        data.put("submissionDate", form.getCreatedAt());
                        data.put("status", form.getStatus().toString());
                        data.put("birthDate", form.getPatient().getBirthdate());
                        data.put("gender", form.getPatient().getGender().toString());
                        String phone = form.getPatient() != null ? form.getPatient().getPhone() : "";
                        data.put("phoneNumber", phone);
                        data.put("address", form.getPatient().getAddress());
                        data.put("lastSeizureDate", form.getDateLastSeizure());

                        return data;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(formData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}