package com.na.medical_mobile_app.controllers;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.FormResponse;
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
@CrossOrigin(origins = "*")
public class MedicalFormController {

    @Autowired
    private MedicalFormService medicalFormService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private FormResponseService formResponseService;

    //-------------------Form submission : Method M->N---------------------------------------------------------------------------------
    @PostMapping("/submit")
    public ResponseEntity<Integer> submitMedicalForm(
            @RequestParam("form") String formJson,
            @RequestPart(value = "mriPhoto", required = false) MultipartFile mriPhoto,
            @RequestPart(value = "seizureVideo", required = false) MultipartFile seizureVideo) {
        MedicalFormRequest form;
        try {
            // Convert JSON string to MedicalFormRequest object
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // For handling LocalDate
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            form = objectMapper.readValue(formJson, MedicalFormRequest.class);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
        try {
            User currentUser = userService.getLoggedInUser(); // get the logged in user
            Integer formId = medicalFormService.saveMedicalForm(form, mriPhoto, seizureVideo, currentUser);
            return ResponseEntity.ok(formId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Map<String, Object>>> getMedicalFormsForDoctor(
            @RequestParam(value = "filter", defaultValue = "active") String filter) {
        try {
            // Get the current logged-in doctor
            User currentDoctor = userService.getLoggedInUser();
            
            List<Map<String, Object>> transformed;
            
            // Filter forms based on the requested filter
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
     * Check if a form has any responses - for doctors to check their forms
     */
    @GetMapping("/responses/check/{formId}")
    public ResponseEntity<?> checkFormResponse(@PathVariable Integer formId) {
        try {
            // Get the current logged-in doctor
            User currentDoctor = userService.getLoggedInUser();
            
            // Verify that this form belongs to the doctor
            boolean isOwnForm = medicalFormService.isFormCreatedByDoctor(formId, currentDoctor);
            if (!isOwnForm) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to access this form"));
            }
            
            boolean hasResponse = formResponseService.hasResponse(formId);
            return ResponseEntity.ok(Map.of("hasResponse", hasResponse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get the neurologist's response for a form - for doctors to view responses to their forms
     */
    @GetMapping("/responses/{formId}")
    public ResponseEntity<?> getFormResponse(@PathVariable Integer formId) {
        try {
            // Get the current logged-in doctor
            User currentDoctor = userService.getLoggedInUser();
            
            // Verify that this form belongs to the doctor
            boolean isOwnForm = medicalFormService.isFormCreatedByDoctor(formId, currentDoctor);
            if (!isOwnForm) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to access this form"));
            }
            
            Optional<FormResponse> response = formResponseService.getLatestResponseForForm(formId);
            
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
                
                return ResponseEntity.ok(responseData);
            } else {
                return ResponseEntity.ok(Map.of("message", "No response found for this form"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}