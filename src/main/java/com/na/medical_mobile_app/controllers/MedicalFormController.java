package com.na.medical_mobile_app.controllers;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.FormResponse;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.services.FormResponseService;
import com.na.medical_mobile_app.services.MedicalFormService;
import com.na.medical_mobile_app.services.UserService;
import com.na.medical_mobile_app.utils.MedicalFormMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-forms")

public class MedicalFormController {

    @Autowired
    private MedicalFormService medicalFormService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private FormResponseService formResponseService;

    //-------------------Form submission : Method M->N---------------------------------------------------------------------------------
    @PostMapping("/submit")
    public ResponseEntity<?> submitMedicalForm(
            @RequestParam("form") String formJson,
            @RequestPart(value = "mriPhoto", required = false) MultipartFile mriPhoto,
            @RequestPart(value = "seizureVideo", required = false) MultipartFile seizureVideo) {
        
        System.out.println("🔥 Received medical form submission");
        System.out.println("📄 MRI Photo: " + (mriPhoto != null ? mriPhoto.getOriginalFilename() + " (" + mriPhoto.getSize() + " bytes)" : "null"));
        System.out.println("📄 Seizure Video: " + (seizureVideo != null ? seizureVideo.getOriginalFilename() + " (" + seizureVideo.getSize() + " bytes)" : "null"));
        
        MedicalFormRequest form;
        try {
            
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            form = objectMapper.readValue(formJson, MedicalFormRequest.class);
            System.out.println("✅ Successfully parsed form JSON");
        } catch (Exception e) {
            System.err.println("❌ Error parsing form JSON: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid form data: " + e.getMessage()));
        }
        
        try {
            User currentUser = userService.getLoggedInUser();
            System.out.println("👤 Current user: " + currentUser.getEmail());
            
            Integer formId = medicalFormService.saveMedicalForm(form, mriPhoto, seizureVideo, currentUser);
            System.out.println("✅ Form saved successfully with ID: " + formId);
            
            return ResponseEntity.ok(Map.of("formId", formId, "message", "Form submitted successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error saving medical form: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "File upload error: " + e.getMessage()));
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Map<String, Object>>> getMedicalFormsForDoctor(
            @RequestParam(value = "filter", defaultValue = "active") String filter) {
        try {

            User currentDoctor = userService.getLoggedInUser();
            
            List<Map<String, Object>> transformed;
            

            switch (filter.toLowerCase()) {
                case "all":
                    transformed = MedicalFormMapper.toSimpleList(
                        medicalFormService.getMedicalFormsByDoctor(currentDoctor));
                    break;
                case "active":
                    transformed = MedicalFormMapper.toSimpleList(
                        medicalFormService.getActiveMedicalFormsByDoctor(currentDoctor));
                    break;
                case "completed":
                    transformed = MedicalFormMapper.toSimpleList(
                        medicalFormService.getCompletedMedicalFormsByDoctor(currentDoctor));
                    break;
                case "recent":
                    transformed = MedicalFormMapper.toSimpleList(
                        medicalFormService.getRecentMedicalFormsByDoctor(currentDoctor));
                    break;
                default:
                    transformed = MedicalFormMapper.toSimpleList(
                        medicalFormService.getActiveMedicalFormsByDoctor(currentDoctor));
            }
            
            return ResponseEntity.ok(transformed);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    

    /**
     * Get form response for a specific form - for doctors to view neurologist responses
     * FIXED VERSION: Uses the new doctor-friendly permission system
     */
    @GetMapping("/{formId}/response")
    public ResponseEntity<?> getFormResponseForDoctor(@PathVariable Integer formId) {
        try {
            User currentDoctor = userService.getLoggedInUser();
            System.out.println("👤 Doctor requesting response for form: " + formId + " - User: " + currentDoctor.getName());
            
            // Use the new doctor-friendly permission system
            Optional<FormResponse> response = formResponseService.getLatestResponseForForm(formId, currentDoctor);
            
            if (response.isPresent()) {
                Map<String, Object> responseData = new HashMap<>();
                FormResponse r = response.get();
                
                responseData.put("responseId", r.getResponseId());
                responseData.put("responseType", r.getResponseType());
                responseData.put("diagnosis", r.getDiagnosis());
                responseData.put("recommendations", r.getRecommendations());
                responseData.put("treatmentSuggestions", r.getTreatmentSuggestions());
                responseData.put("medicationChanges", r.getMedicationChanges());
                responseData.put("followUpInstructions", r.getFollowUpInstructions());
                responseData.put("requiresSupervision", r.getRequiresSupervision());
                responseData.put("urgencyLevel", r.getUrgencyLevel());
                responseData.put("followUpRequired", r.getFollowUpRequired());
                responseData.put("followUpDate", r.getFollowUpDate());
                responseData.put("createdAt", r.getCreatedAt());
                responseData.put("neurologistName", r.getResponder().getName());
                responseData.put("neurologistEmail", r.getResponder().getEmail());
                responseData.put("neurologistRole", r.getResponder().getRole());
                
                System.out.println("✅ Returning response for form: " + formId);
                return ResponseEntity.ok(responseData);
            } else {
                System.out.println("ℹ️ No response found for form: " + formId);
                return ResponseEntity.ok(Map.of("message", "No response found for this form"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting form response: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Check if a form has any responses - for doctors to check their forms
     * FIXED VERSION: Uses the new doctor-friendly permission system
     */
    @GetMapping("/{formId}/has-response")
    public ResponseEntity<?> checkFormResponse(@PathVariable Integer formId) {
        try {

            User currentDoctor = userService.getLoggedInUser();
            System.out.println("👤 Checking response for form: " + formId + " by user: " + currentDoctor.getName());
            
            // Use the new doctor-friendly permission system
            boolean hasResponse = formResponseService.hasResponse(formId, currentDoctor);
            System.out.println("📋 Form " + formId + " has response: " + hasResponse);
            return ResponseEntity.ok(Map.of("hasResponse", hasResponse));
        } catch (Exception e) {
            System.err.println("❌ Error checking form response: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get the neurologist's response for a form - for doctors to view responses to their forms
     * FIXED VERSION: Uses the new doctor-friendly permission system
     */
    @GetMapping("/{formId}/response-details")
    public ResponseEntity<?> getFormResponseDetails(@PathVariable Integer formId) {
        try {

            User currentDoctor = userService.getLoggedInUser();
            System.out.println("👤 Getting response details for form: " + formId + " by user: " + currentDoctor.getName());
            
            // Use the new doctor-friendly permission system
            Optional<FormResponse> response = formResponseService.getLatestResponseForForm(formId, currentDoctor);
            
            if (response.isPresent()) {
                Map<String, Object> responseData = new HashMap<>();
                FormResponse r = response.get();
                
                responseData.put("responseId", r.getResponseId());
                responseData.put("responseType", r.getResponseType());
                responseData.put("diagnosis", r.getDiagnosis());
                responseData.put("recommendations", r.getRecommendations());
                responseData.put("treatmentSuggestions", r.getTreatmentSuggestions());
                responseData.put("medicationChanges", r.getMedicationChanges());
                responseData.put("followUpInstructions", r.getFollowUpInstructions());
                responseData.put("requiresSupervision", r.getRequiresSupervision());
                responseData.put("urgencyLevel", r.getUrgencyLevel());
                responseData.put("followUpRequired", r.getFollowUpRequired());
                responseData.put("followUpDate", r.getFollowUpDate());
                responseData.put("createdAt", r.getCreatedAt());
                responseData.put("neurologistName", r.getResponder().getName());
                responseData.put("neurologistEmail", r.getResponder().getEmail());
                responseData.put("neurologistSpecialization", r.getResponder().getSpecialization());
                
                System.out.println("✅ Returning response details for form: " + formId);
                return ResponseEntity.ok(responseData);
            } else {
                System.out.println("ℹ️ No response found for form: " + formId);
                return ResponseEntity.ok(Map.of("message", "No response found for this form"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting form response details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}