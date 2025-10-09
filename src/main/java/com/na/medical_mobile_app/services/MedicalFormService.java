package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MedicalFormService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalFormRepository medicalFormRepository;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private NeurologistAssignmentService neurologistAssignmentService;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private PdfStorageService pdfStorageService;

    // ... existing buildSymptomsSummary method (keep it as is) ...

    private String buildSymptomsSummary(MedicalFormRequest request) {
        StringBuilder summary = new StringBuilder();

        // Debug logging
        System.out.println("=== DEBUG: Building symptoms summary ===");
        System.out.println("seizureType: " + request.seizureType);
        System.out.println("progressiveFall: " + request.progressiveFall);
        System.out.println("suddenFall: " + request.suddenFall);
        System.out.println("clonicJerks: " + request.clonicJerks);
        System.out.println("automatisms: " + request.automatisms);
        System.out.println("activityStop: " + request.activityStop);
        System.out.println("sensitiveDisorders: " + request.sensitiveDisorders);
        System.out.println("sensoryDisorders: " + request.sensoryDisorders);
        System.out.println("lateralTongueBiting: " + request.lateralTongueBiting);

        // Seizure type (single choice)
        if (request.seizureType != null && !request.seizureType.isBlank()) {
            String seizureTypeLabel = switch (request.seizureType) {
                case "generalizedTonicClonic" -> "Généralisée Tonico-clonique";
                case "generalizedOther" -> "Généralisée autre (tonique, clonique, myoclonique, atonique)";
                case "absence" -> "Absence";
                case "focalWithLossOfConsciousness" -> "Focale avec perte de connaissance";
                case "focalWithoutLossOfConsciousness" -> "Focale sans perte de connaissance";
                default -> request.seizureType;
            };
            summary.append("- Type de crise: ").append(seizureTypeLabel).append("\n");
        }

        // Updated "Pendant la crise" symptoms
        if (Boolean.TRUE.equals(request.lossOfConsciousness)) summary.append("- Perte de connaissance\n");
        if (Boolean.TRUE.equals(request.progressiveFall)) summary.append("- Chute progressive\n");
        if (Boolean.TRUE.equals(request.suddenFall)) summary.append("- Chute brusque\n");
        if (Boolean.TRUE.equals(request.bodyStiffening)) summary.append("- Raidissement du corps\n");
        if (Boolean.TRUE.equals(request.clonicJerks)) summary.append("- Secousses cloniques\n");
        if (Boolean.TRUE.equals(request.automatisms)) summary.append("- Automatismes\n");
        if (Boolean.TRUE.equals(request.eyeDeviation)) summary.append("- Déviation des yeux (d'un côté)\n");
        if (Boolean.TRUE.equals(request.activityStop)) summary.append("- Arrêt de l'activité en cours\n");
        if (Boolean.TRUE.equals(request.sensitiveDisorders)) summary.append("- Troubles sensitifs\n");
        if (Boolean.TRUE.equals(request.sensoryDisorders)) summary.append("- Troubles sensoriels\n");
        if (Boolean.TRUE.equals(request.incontinence)) summary.append("- Incontinence (urine/selles)\n");
        if (Boolean.TRUE.equals(request.lateralTongueBiting)) summary.append("- Morsure latérale de la langue\n");

        // First seizure info
        if (Boolean.TRUE.equals(request.isFirstSeizure)) {
            summary.append("- Première crise\n");
        }

        // Aura info
        if (Boolean.TRUE.equals(request.hasAura)) {
            summary.append("- Aura présente");
            if (request.auraDescription != null && !request.auraDescription.isBlank()) {
                summary.append(" : ").append(request.auraDescription);
            }
            summary.append("\n");
        }

        // Other info
        if (request.otherInformation != null && !request.otherInformation.isBlank()) {
            summary.append("- Autres: ").append(request.otherInformation).append("\n");
        }

        String result = summary.toString().trim();
        System.out.println("Final symptoms summary: " + result);
        System.out.println("=== END DEBUG ===");
        
        return result;
    }

    //-----------------------------------------------Saving the medical form---------------------------------------------------
    /**
     * Saves a medical form submission including patient information and attachments
     * @param request The form data containing all fields from the medical form
     * @return The ID of the saved form submission
     */
    @Transactional
    public Integer saveMedicalForm(
            MedicalFormRequest request,
            MultipartFile mriPhoto,
            MultipartFile seizureVideo,
            User uploadedBy
    ) throws Exception {
        if (request == null || request.cinNumber == null) {
            throw new IllegalArgumentException("Request and CIN number cannot be null");
        }

        // Patient population
        Patient patient = patientService.findOrCreatePatient(request);

        // Get the current doctor (sender)
        User defaultUser = userService.getLoggedInUser();
        
        // The improved neurologist assignment service
        User neurologue = neurologistAssignmentService.assignNeurologistToForm(patient, request);

        // Create medical form
        MedicalForm medicalForm = new MedicalForm();
        medicalForm.setPatient(patient);
        medicalForm.setDateFirstSeizure(request.firstSeizureDate);
        medicalForm.setDateLastSeizure(request.lastSeizureDate);
        medicalForm.setTotalSeizures(request.totalSeizures);
        medicalForm.setAverageSeizureDuration(request.seizureDuration);
        medicalForm.setSeizureFrequency(request.seizureFrequency);
        medicalForm.setCreatedAt(LocalDateTime.now());
        medicalForm.setStatus(FormStatus.SUBMITTED);
        medicalForm.setDoctor(defaultUser);
        medicalForm.setAssignedTo(neurologue);
        medicalForm.setSymptoms(buildSymptomsSummary(request));

        // Save the form first to get an ID
        medicalForm = medicalFormRepository.save(medicalForm);

        // Handle attachments
        List<FileAttachment> attachments = attachmentService.saveAttachments(medicalForm,
                mriPhoto,
                seizureVideo,
                uploadedBy);
        medicalForm.setAttachments(attachments);
        medicalForm = medicalFormRepository.save(medicalForm);

        // Update patient's referring doctor
        patient.setReferringDoctor(defaultUser);
        patientRepository.save(patient);
        
        // Create notification for the neurologist
        notificationService.createNewFormNotification(medicalForm);

        // Generate and save PDF automatically
        generateAndSavePdf(medicalForm);

        return medicalForm.getFormId();
    }

    /**
     * Generate PDF for a medical form and save it to file system
     */
    public void generateAndSavePdf(MedicalForm form) {
        try {
            System.out.println("Starting PDF generation for form ID: " + form.getFormId());
            
            // Generate PDF
            byte[] pdfData = pdfGenerationService.generateMedicalFormPdf(form);
            System.out.println("PDF generated successfully, size: " + pdfData.length + " bytes");
            
            // Generate filename
            String fileName = pdfGenerationService.generatePdfFileName(form);
            System.out.println("Generated PDF filename: " + fileName);
            
            // Save to file system
            String filePath = pdfStorageService.savePdfToFileSystem(pdfData, fileName);
            System.out.println("PDF saved to: " + filePath);
            
            // Update form with PDF information
            form.setPdfGenerated(true);
            form.setPdfGeneratedAt(LocalDateTime.now());
            form.setPdfFileName(fileName);
            form.setPdfFilePath(filePath);
            
            medicalFormRepository.save(form);
            
            System.out.println("PDF generation completed successfully for form ID: " + form.getFormId());
            
        } catch (Exception e) {
            System.err.println("Error generating PDF for form ID: " + form.getFormId());
            e.printStackTrace();
            // Don't throw exception to avoid breaking form submission
        }
    }

    /**
     * Get PDF data for a medical form
     */
    public byte[] getPdfData(Integer formId) throws Exception {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new Exception("Form not found with ID: " + formId));
        
        if (!form.getPdfGenerated() || form.getPdfFilePath() == null) {
            System.out.println("PDF not found for form ID: " + formId + ", generating now...");
            // Generate PDF if not already generated
            generateAndSavePdf(form);
        }
        
        try {
            return pdfStorageService.loadPdfFromFileSystem(form.getPdfFilePath());
        } catch (Exception e) {
            System.err.println("Error loading PDF for form ID: " + formId);
            // Try to regenerate PDF if loading fails
            generateAndSavePdf(form);
            return pdfStorageService.loadPdfFromFileSystem(form.getPdfFilePath());
        }
    }

    /**
     * Get all medical forms with PDF information for admin
     */
    public List<MedicalForm> getAllMedicalFormsWithPdf() {
        List<MedicalForm> forms = medicalFormRepository.findAll();
        System.out.println("Retrieved " + forms.size() + " medical forms for admin");
        return forms;
    }

    // ... keep all other existing methods as they are ...

    /**
     * Get all medical forms in the system
     */
    public List<MedicalForm> getAllMedicalForms() {
        return medicalFormRepository.findAll();
    }
    
    /**
     * Get medical forms created by a specific doctor
     */
    public List<MedicalForm> getMedicalFormsByDoctor(User doctor) {
        return medicalFormRepository.findByDoctor(doctor);
    }
    
    /**
     * Get active (non-completed) medical forms created by a specific doctor
     * This helps doctors focus on forms that still need attention
     */
    public List<MedicalForm> getActiveMedicalFormsByDoctor(User doctor) {
        // Get all statuses except COMPLETED
        List<FormStatus> activeStatuses = Arrays.asList(
            FormStatus.SUBMITTED, 
            FormStatus.UNDER_REVIEW, 
            FormStatus.REQUIRES_SUPERVISION
        );
        
        return medicalFormRepository.findByDoctorAndStatusIn(doctor, activeStatuses);
    }
    
    /**
     * Get completed medical forms created by a specific doctor
     */
    public List<MedicalForm> getCompletedMedicalFormsByDoctor(User doctor) {
        return medicalFormRepository.findByDoctorAndStatus(doctor, FormStatus.COMPLETED);
    }
    
    /**
     * Get recent medical forms created by a specific doctor (last 30 days)
     */
    public List<MedicalForm> getRecentMedicalFormsByDoctor(User doctor) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return medicalFormRepository.findByDoctorAndCreatedAtAfter(doctor, thirtyDaysAgo);
    }
    
    /**
     * Check if a form was created by a specific doctor
     */
    public boolean isFormCreatedByDoctor(Integer formId, User doctor) {
        Optional<MedicalForm> form = medicalFormRepository.findById(formId);
        if (form.isEmpty()) {
            return false;
        }
        
        return form.get().getDoctor().getUserId().equals(doctor.getUserId());
    }
}