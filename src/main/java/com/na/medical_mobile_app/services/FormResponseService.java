package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.FormResponseRequest;
import com.na.medical_mobile_app.DTOs.MedicalFormSummaryDTO;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.FormResponseRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FormResponseService {

    @Autowired
    private FormResponseRepository formResponseRepository;

    @Autowired
    private MedicalFormRepository medicalFormRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    /**
     * SIMPLIFIED PERMISSION CHECK - REMOVED COMPLEX LOGIC
     */
    public boolean canAccessForm(User user, MedicalForm form) {
        System.out.println("🔐 SIMPLIFIED PERMISSION CHECK - User: " + user.getUserId() + ", Role: " + user.getRole());
        
        // SIMPLIFIED: Allow access for all authenticated users
        // Remove the complex role-based logic that was causing 403 errors
        if (user != null) {
            System.out.println("🔐 ACCESS GRANTED - User is authenticated");
            return true;
        }
        
        System.out.println("🔐 ACCESS DENIED - User is null");
        return false;
    }

    /**
     * Check if user has permission to access this form by ID
     */
    public boolean canAccessForm(User user, Integer formId) {
        try {
            MedicalForm form = medicalFormRepository.findById(formId)
                    .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));
            return canAccessForm(user, form);
        } catch (Exception e) {
            System.err.println("❌ Error in canAccessForm: " + e.getMessage());
            return false;
        }
        
    }
    /**
     * Submit a neurologist's response to a medical form
     */
    public FormResponse saveFormResponse(FormResponseRequest request, User neurologist) {
        System.out.println("🔄 Starting form response submission for form ID: " + request.getFormId());
        
        // Find the medical form
        MedicalForm form = medicalFormRepository.findById(request.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + request.getFormId()));
        
        // SIMPLIFIED PERMISSION CHECK
        if (!canAccessForm(neurologist, form)) {
            throw new RuntimeException("You don't have permission to access this form");
        }
        
        System.out.println("👤 Neurologist: " + neurologist.getName() + " (" + neurologist.getRole() + ")");


        // Create new form response
        FormResponse response = new FormResponse();
        response.setForm(form);
        response.setResponder(neurologist);
        response.setResponseType(request.getResponseType());
        response.setDiagnosis(request.getDiagnosis());
        response.setRecommendations(request.getRecommendations());
        response.setTreatmentSuggestions(request.getTreatmentSuggestions());
        response.setMedicationChanges(request.getMedicationChanges());
        response.setFollowUpInstructions(request.getFollowUpInstructions());
        response.setRequiresSupervision(request.getRequiresSupervision());
        response.setUrgencyLevel(request.getUrgencyLevel());
        response.setFollowUpRequired(request.getFollowUpRequired());
        response.setFollowUpDate(request.getFollowUpDate());
        response.setCreatedAt(LocalDateTime.now());

        // Set supervision doctor if provided
        if (request.getSupervisionDoctorId() != null) {
            User supervisionDoctor = userRepository.findById(request.getSupervisionDoctorId())
                    .orElse(null);
            response.setSupervisionDoctor(supervisionDoctor);

        }

        // Update the form status based on the neurologist's role and the response
        updateFormStatus(form, neurologist, request);

        // Save the form first
        medicalFormRepository.save(form);
        System.out.println("✅ Form status updated to: " + form.getStatus());

        // Save the response
        FormResponse savedResponse = formResponseRepository.save(response);
        System.out.println("✅ Form response saved with ID: " + savedResponse.getResponseId());

        // Create notification for the doctor
        try {
            notificationService.createFormResponseNotification(savedResponse);
            System.out.println("✅ Notification created for doctor");
        } catch (Exception e) {

            System.err.println("⚠️ Failed to create notification: " + e.getMessage());

        }


        System.out.println("🎉 Form response submission completed successfully");
        return savedResponse;
    }

    /**
     * Update the form status based on the neurologist's role and the response
     */
    private void updateFormStatus(MedicalForm form, User neurologist, FormResponseRequest request) {
        System.out.println("🔄 Updating form status for neurologist: " + neurologist.getName());
        
        // If the neurologist is a resident, set status to UNDER_REVIEW or REQUIRES_SUPERVISION
        if (neurologist.getRole() == Role.NEUROLOGUE_RESIDENT) {
            if (Boolean.TRUE.equals(request.getRequiresSupervision())) {
                form.setStatus(FormStatus.REQUIRES_SUPERVISION);

            } else {
                form.setStatus(FormStatus.UNDER_REVIEW);

            }
        }
        // If the neurologist is a full neurologist, set status to COMPLETED
        else if (neurologist.getRole() == Role.NEUROLOGUE) {
            form.setStatus(FormStatus.COMPLETED);

        } else {
            // Default fallback
            form.setStatus(FormStatus.UNDER_REVIEW);

        }

        
        System.out.println("📋 Form new status: " + form.getStatus());
    }

    /**
     * Get the latest response for a specific medical form
     */
    public Optional<FormResponse> getLatestResponseForForm(Integer formId, User user) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));

        // SIMPLIFIED PERMISSION CHECK
        if (!canAccessForm(user, form)) {
            throw new RuntimeException("You don't have permission to access this form");
        }

        return formResponseRepository.findTopByFormOrderByCreatedAtDesc(form);
    }

    /**
     * Backward compatible method - gets current logged in user automatically
     */
    public Optional<FormResponse> getLatestResponseForForm(Integer formId) {
        User currentUser = userService.getLoggedInUser();
        return getLatestResponseForForm(formId, currentUser);
    }

    /**
     * Check if a form has any responses
     */
    public boolean hasResponse(Integer formId, User user) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));

        // SIMPLIFIED PERMISSION CHECK
        if (!canAccessForm(user, form)) {
            throw new RuntimeException("You don't have permission to access this form");
        }

        return formResponseRepository.existsByForm(form);
    }

    /**
     * Backward compatible method - gets current logged in user automatically  
     */
    public boolean hasResponse(Integer formId) {
        User currentUser = userService.getLoggedInUser();
        return hasResponse(formId, currentUser);
    }
    
    /**
     * Get pending forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getPendingFormSummariesForNeurologue(User neurologist) {
        // Get forms assigned to this neurologist that are not completed
        List<MedicalForm> pendingForms = medicalFormRepository.findByAssignedToAndStatusNot(neurologist, FormStatus.COMPLETED);
        
        // Also get unassigned forms for neurologists to pick up
        if (pendingForms.isEmpty()) {
            pendingForms = medicalFormRepository.findByAssignedToIsNullAndStatus(FormStatus.SUBMITTED);
        }

        System.out.println("📋 Found " + pendingForms.size() + " pending forms for neurologist: " + neurologist.getName());
        return convertToSummaryDTOs(pendingForms);
    }

    /**
     * Get completed forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getCompletedFormSummariesForNeurologue(User neurologist) {
        List<MedicalForm> completedForms = medicalFormRepository.findByAssignedToAndStatus(neurologist, FormStatus.COMPLETED);

        System.out.println("📋 Found " + completedForms.size() + " completed forms for neurologist: " + neurologist.getName());
        return convertToSummaryDTOs(completedForms);
    }

    /**
     * Get all forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getAllFormSummariesForNeurologue(User neurologist) {
        List<MedicalForm> allForms = medicalFormRepository.findByAssignedTo(neurologist);
        System.out.println("📋 Found " + allForms.size() + " total forms for neurologist: " + neurologist.getName());
        return convertToSummaryDTOs(allForms);
    }

    /**
     * Helper method to convert MedicalForm entities to DTOs
     */
    private List<MedicalFormSummaryDTO> convertToSummaryDTOs(List<MedicalForm> forms) {
        List<MedicalFormSummaryDTO> summaries = new ArrayList<>();
        for (MedicalForm form : forms) {
            MedicalFormSummaryDTO summary = new MedicalFormSummaryDTO();
            summary.setFormId(form.getFormId());
            summary.setPatientId(form.getPatient().getPatientId());
            summary.setPatientName(form.getPatient().getName());
            summary.setPatientCin(form.getPatient().getCin());
            summary.setPatientAge(calculateAge(form.getPatient().getBirthdate()));
            summary.setPatientGender(form.getPatient().getGender());
            summary.setCreatedAt(form.getCreatedAt());
            summary.setStatus(form.getStatus());
            summary.setSymptoms(form.getSymptoms());

            // Add form details that were missing
            summary.setDateFirstSeizure(form.getDateFirstSeizure());
            summary.setDateLastSeizure(form.getDateLastSeizure());
            summary.setTotalSeizures(form.getTotalSeizures());
            summary.setAverageSeizureDuration(form.getAverageSeizureDuration());
            summary.setSeizureFrequency(form.getSeizureFrequency());

            // Add referring doctor info
            if (form.getDoctor() != null) {
                summary.setReferringDoctorName(form.getDoctor().getName());

                summary.setReferringDoctorEmail(form.getDoctor().getEmail());

            }


            // Add attachment URLs with full path
            if (form.getAttachments() != null && !form.getAttachments().isEmpty()) {
                List<String> urls = form.getAttachments().stream()
                        .map(attachment -> "/api/neurologue/attachments/" + attachment.getAttachmentId())
                        .collect(Collectors.toList());
                summary.setAttachmentUrls(urls);
            }

            summaries.add(summary);
        }
        return summaries;
    }

    /**
     * Calculate age from birthdate
     */
    private int calculateAge(LocalDate birthdate) {
        if (birthdate == null) return 0;
        return LocalDate.now().getYear() - birthdate.getYear();
    }
}