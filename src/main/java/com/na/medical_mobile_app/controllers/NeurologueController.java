// controllers/NeurologueController.java - COMPLETE CORRECTED VERSION
package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.FormResponseRequest;
import com.na.medical_mobile_app.DTOs.MedicalFormSummaryDTO;
import com.na.medical_mobile_app.entities.FileAttachment;
import com.na.medical_mobile_app.entities.FormResponse;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.UserRepository;
import com.na.medical_mobile_app.services.AttachmentService;
import com.na.medical_mobile_app.services.FormResponseService;
import com.na.medical_mobile_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/neurologue")

public class NeurologueController {

    @Autowired
    private FormResponseService formResponseService;
    @Autowired
    private UserService userService;
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private UserRepository userRepository;

    //---------------------------------------------Getting the attachement for the neuro----------------------------------------------
    @GetMapping("/attachments/{id}")
    public ResponseEntity<byte[]> serveAttachment(@PathVariable Integer id,
                                                 @RequestParam(value = "userId", required = false) Integer userId,
                                                 @RequestHeader(value = "userId", required = false) String userIdHeader) throws Exception {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            FileAttachment attachment = attachmentService.getAttachmentById(id);
            
            // Check if user has permission to access this attachment
            if (!formResponseService.canAccessForm(user, attachment.getForm())) {
                return ResponseEntity.status(403).body(null);
            }
            
            byte[] decryptedBytes = attachmentService.getDecryptedAttachmentBytes(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, attachment.getMimeType())
                    .body(decryptedBytes);
        } catch (Exception e) {
            System.err.println("❌ Error serving attachment: " + e.getMessage());
            return ResponseEntity.status(403).body(null);
        }

    }


    @GetMapping("/forms/{formId}/attachments")
    public ResponseEntity<?> getAttachmentsForForm(
            @PathVariable Integer formId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader) {
        
        try {
            User user = getUserFromParams(userId, userIdHeader);
            
            // Check permission first
            if (!formResponseService.canAccessForm(user, formId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to access this form"));
            }
            
            List<FileAttachment> attachments = attachmentService.getAttachmentsByFormId(formId);
            System.out.println("✅ Found " + attachments.size() + " attachments for form " + formId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            System.err.println("❌ Error getting attachments: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint for a neurologist to respond to a medical form
     */
    //-----------------------------------------Responding to a form--------------------------------------------------------
    @PostMapping(value = "/form-response", 
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> submitFormResponse(
            @RequestBody FormResponseRequest request,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            System.out.println("📥 Received form response submission");
            System.out.println("📋 Form ID: " + request.getFormId());
            System.out.println("📋 Response Type: " + request.getResponseType());
            
            User user = getUserFromParams(userId, userIdHeader);
            FormResponse response = formResponseService.saveFormResponse(request, user);
            
            System.out.println("✅ Form response saved successfully with ID: " + response.getResponseId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error submitting form response: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit form response: " + e.getMessage()));
        }
    }
    
    /**
     * Check if a form has any responses
     */
    @GetMapping("/form-response/check/{formId}")
    public ResponseEntity<?> checkResponseStatus(
            @PathVariable Integer formId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            boolean hasResponse = formResponseService.hasResponse(formId, user);
            return ResponseEntity.ok(Map.of("hasResponse", hasResponse));
        } catch (Exception e) {
            System.err.println("❌ Error checking response status: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get the latest response for a specific medical form
     */
    @GetMapping("/form-response/{formId}")
    public ResponseEntity<?> getResponseForForm(
            @PathVariable Integer formId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            Optional<FormResponse> response = formResponseService.getLatestResponseForForm(formId, user);
            
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
            System.err.println("❌ Error getting form response: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }

    }



    //--------------------------------------Getting all pending forms with status not completed--------------------------
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFormsForNeurologue(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            
            System.out.println("✅ Using user: " + user.getName() + ", Role: " + user.getRole() + ", ID: " + user.getUserId());
            

            List<MedicalFormSummaryDTO> forms = formResponseService.getPendingFormSummariesForNeurologue(user);
            System.out.println("✅ Found " + forms.size() + " pending forms for user");
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            System.err.println("❌ Error getting pending forms: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }
    
    //--------------------------------------Getting all completed forms (forms with responses)--------------------------
    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedFormsForNeurologue(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            
            System.out.println("✅ Getting completed forms for user: " + user.getName());
            

            List<MedicalFormSummaryDTO> forms = formResponseService.getCompletedFormSummariesForNeurologue(user);

            System.out.println("✅ Found " + forms.size() + " completed forms for user");
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            System.err.println("❌ Error getting completed forms: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }
    
    //--------------------------------------Getting all forms (both pending and completed)--------------------------
    @GetMapping("/all-forms")
    public ResponseEntity<?> getAllFormsForNeurologue(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            User user = getUserFromParams(userId, userIdHeader);
            
            System.out.println("✅ Getting all forms for user: " + user.getName());
            

            List<MedicalFormSummaryDTO> forms = formResponseService.getAllFormSummariesForNeurologue(user);
            System.out.println("✅ Found " + forms.size() + " total forms for user");
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            System.err.println("❌ Error getting all forms: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Helper method to get user from parameters, headers, or authentication
     */
    private User getUserFromParams(Integer userId, String userIdHeader) {
        User user = null;
        
        // First try to get user from request parameter
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElse(null);
            System.out.println("✅ Using user from request parameter: " + userId);
        } 
        // Then try from header
        else if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                Integer id = Integer.parseInt(userIdHeader);
                user = userRepository.findById(id).orElse(null);
                System.out.println("✅ Using user from request header: " + id);
            } catch (NumberFormatException ignored) {
                // Not a valid ID, continue
            }
        }
        
        // If no user found from parameters, try authentication
        if (user == null) {
            try {
                user = userService.getLoggedInUser();
                System.out.println("✅ Using authenticated user: " + user.getName());
            } catch (Exception e) {
                System.err.println("❌ Authentication failed: " + e.getMessage());
                throw new RuntimeException("No valid user found. Please provide a userId parameter or header, or authenticate properly.");
            }
        }
        
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        return user;
    }

}
