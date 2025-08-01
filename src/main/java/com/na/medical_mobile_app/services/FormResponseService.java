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
     * Submit a neurologist's response to a medical form
     */
    public FormResponse saveFormResponse(FormResponseRequest request) {
        // Get the current user (neurologist)
        User neurologist = userService.getLoggedInUser();

        // Find the medical form
        MedicalForm form = medicalFormRepository.findById(request.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + request.getFormId()));

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

        medicalFormRepository.save(form);

        // Save the response
        FormResponse savedResponse = formResponseRepository.save(response);

        // Create notification for the doctor
        notificationService.createFormResponseNotification(savedResponse);

        return savedResponse;
    }

    /**
     * Update the form status based on the neurologist's role and the response
     */
    private void updateFormStatus(MedicalForm form, User neurologist, FormResponseRequest request) {
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
        }
    }

    /**
     * Get the latest response for a specific medical form
     */
    public Optional<FormResponse> getLatestResponseForForm(Integer formId) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));

        return formResponseRepository.findTopByFormOrderByCreatedAtDesc(form);
    }

    /**
     * Check if a form has any responses
     */
    public boolean hasResponse(Integer formId) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));

        return formResponseRepository.existsByForm(form);
    }

    /**
     * Get pending forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getPendingFormSummariesForNeurologue(User neurologist) {
        List<MedicalForm> pendingForms = medicalFormRepository.findByAssignedTo(neurologist);

        // Filter out forms that are already completed
        pendingForms = pendingForms.stream()
                .filter(form -> form.getStatus() != FormStatus.COMPLETED)
                .collect(Collectors.toList());

        return convertToSummaryDTOs(pendingForms);
    }

    /**
     * Get completed forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getCompletedFormSummariesForNeurologue(User neurologist) {
        List<MedicalForm> completedForms = medicalFormRepository.findByAssignedTo(neurologist);

        // Filter only completed forms
        completedForms = completedForms.stream()
                .filter(form -> form.getStatus() == FormStatus.COMPLETED)
                .collect(Collectors.toList());

        return convertToSummaryDTOs(completedForms);
    }

    /**
     * Get all forms for a neurologist
     */
    public List<MedicalFormSummaryDTO> getAllFormSummariesForNeurologue(User neurologist) {
        List<MedicalForm> allForms = medicalFormRepository.findByAssignedTo(neurologist);
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
            userService.populateReferringDoctorInfo(summary, form.getDoctor());

            // Add attachment URLs with full path
            if (form.getAttachments() != null && !form.getAttachments().isEmpty()) {
                List<String> urls = form.getAttachments().stream()
                        .map(attachment -> "http://192.168.1.4:8080/api/neurologue/attachments/" + attachment.getAttachmentId())
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