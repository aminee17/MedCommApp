// services/MedicalFormService.java
package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(MedicalFormService.class);

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

    // File validation method
    private void validateFiles(MultipartFile mriPhoto, MultipartFile seizureVideo) throws Exception {
        // Validate MRI photo
        if (mriPhoto != null && !mriPhoto.isEmpty()) {
            // Check file size (10MB limit)
            if (mriPhoto.getSize() > 10 * 1024 * 1024) {
                throw new Exception("MRI photo size exceeds 10MB limit");
            }
            
            // Check file type
            String contentType = mriPhoto.getContentType();
            if (contentType != null && !contentType.startsWith("image/")) {
                throw new Exception("MRI photo must be an image file. Received: " + contentType);
            }
            
            logger.info("✅ MRI photo validated: {} ({} bytes)", mriPhoto.getOriginalFilename(), mriPhoto.getSize());
        }

        // Validate seizure video
        if (seizureVideo != null && !seizureVideo.isEmpty()) {
            // Check file size (50MB limit)
            if (seizureVideo.getSize() > 50 * 1024 * 1024) {
                throw new Exception("Seizure video size exceeds 50MB limit");
            }
            
            // Check file type
            String contentType = seizureVideo.getContentType();
            if (contentType != null && !contentType.startsWith("video/")) {
                throw new Exception("Seizure video must be a video file. Received: " + contentType);
            }
            
            logger.info("✅ Seizure video validated: {} ({} bytes)", seizureVideo.getOriginalFilename(), seizureVideo.getSize());
        }
    }



    private String buildSymptomsSummary(MedicalFormRequest request) {
        StringBuilder summary = new StringBuilder();

        // Debug logging
        logger.info("=== Building symptoms summary ===");
        logger.info("seizureType: {}", request.seizureType);
        logger.info("progressiveFall: {}", request.progressiveFall);
        logger.info("suddenFall: {}", request.suddenFall);
        logger.info("clonicJerks: {}", request.clonicJerks);
        logger.info("automatisms: {}", request.automatisms);
        logger.info("activityStop: {}", request.activityStop);
        logger.info("sensitiveDisorders: {}", request.sensitiveDisorders);
        logger.info("sensoryDisorders: {}", request.sensoryDisorders);
        logger.info("lateralTongueBiting: {}", request.lateralTongueBiting);

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
            summary.append("- Informations supplémentaires: ").append(request.otherInformation).append("\n");
        }

        return summary.toString();
    }

    public Integer saveMedicalForm(MedicalFormRequest request, MultipartFile mriPhoto, MultipartFile seizureVideo, User defaultUser) throws Exception {
        logger.info("Starting medical form submission for user: {}", defaultUser.getEmail());

        // Validate files
        validateFiles(mriPhoto, seizureVideo);

        // Create or find patient
        Patient patient = patientService.findOrCreatePatient(
            request.cin,
            request.patientName,
            request.patientPhone,
            request.patientAddress,
            request.patientGender,
            request.patientBirthdate
        );
        logger.info("Patient processed: {}", patient.getCin());

        // Build MedicalForm entity
        MedicalForm medicalForm = new MedicalForm();
        medicalForm.setPatient(patient);
        medicalForm.setDoctor(defaultUser);
        medicalForm.setDateFirstSeizure(request.dateFirstSeizure);
        medicalForm.setDateLastSeizure(request.dateLastSeizure);
        medicalForm.setTotalSeizures(request.totalSeizures);
        medicalForm.setAverageSeizureDuration(request.averageSeizureDuration);
        medicalForm.setSeizureFrequency(SeizureFrequency.fromString(request.seizureFrequency));
        medicalForm.setSymptoms(buildSymptomsSummary(request));
        medicalForm.setStatus(FormStatus.SUBMITTED);
        medicalForm.setCreatedAt(LocalDateTime.now());

        // Save the form
        medicalForm = medicalFormRepository.save(medicalForm);
        logger.info("Medical form saved with ID: {}", medicalForm.getFormId());

        // Save attachments
        List<Attachment> attachments = attachmentService.saveFormAttachments(medicalForm, mriPhoto, seizureVideo);
        try {
            medicalForm.setAttachments(attachments);
            medicalForm = medicalFormRepository.save(medicalForm);
            logger.info("✅ Attachments saved: {} files", attachments.size());
        } catch (Exception e) {
            logger.error("Error saving attachments: {}", e.getMessage());
            throw new Exception("Failed to save file attachments: " + e.getMessage());
        }

        // Update patient's referring doctor
        try {
            patient.setReferringDoctor(defaultUser);
            patientRepository.save(patient);
            logger.info("Updated patient's referring doctor: {}", defaultUser.getEmail());
        } catch (Exception e) {
            logger.warn("Failed to update patient's referring doctor: {}", e.getMessage());
        }

        // Create notification for the neurologist
        try {
            notificationService.createNewFormNotification(medicalForm);
            logger.info("Notification created for form ID: {}", medicalForm.getFormId());
        } catch (Exception e) {
            logger.warn("Failed to create notification: {}", e.getMessage());
        }

        // Generate and save PDF automatically
        try {
            generateAndSavePdf(medicalForm);
        } catch (Exception e) {
            logger.error("PDF generation failed for form ID: {}, but form was saved", medicalForm.getFormId(), e);
        }

        logger.info("Medical form submission completed successfully for form ID: {}", medicalForm.getFormId());
        return medicalForm.getFormId();
    }


    public void generateAndSavePdf(MedicalForm form) {

        try {
            logger.info("Starting PDF generation for form ID: {}", form.getFormId());
            

            byte[] pdfData = pdfGenerationService.generateMedicalFormPdf(form);

            logger.info("PDF generated successfully, size: {} bytes", pdfData.length);
            

            String fileName = pdfGenerationService.generatePdfFileName(form);

            logger.info("Generated PDF filename: {}", fileName);
            

            String filePath = pdfStorageService.savePdfToFileSystem(pdfData, fileName);

            logger.info("PDF saved to: {}", filePath);
            

            form.setPdfGenerated(true);

            form.setPdfGeneratedAt(LocalDateTime.now());
            form.setPdfFileName(fileName);
            form.setPdfFilePath(filePath);
            
            medicalFormRepository.save(form);
            
            logger.info("PDF generation completed successfully for form ID: {}", form.getFormId());
            
        } catch (Exception e) {
            logger.error("Error generating PDF for form ID: {}", form.getFormId(), e);
        }
    }


    public byte[] getPdfData(Integer formId) throws Exception {

        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new Exception("Form not found with ID: " + formId));
        
        if (!form.getPdfGenerated() || form.getPdfFilePath() == null) {
            logger.info("PDF not found for form ID: {}, generating now...", formId);
            generateAndSavePdf(form);
        }
        
        try {
            return pdfStorageService.loadPdfFromFileSystem(form.getPdfFilePath());
        } catch (Exception e) {
            logger.error("Error loading PDF for form ID: {}, regenerating...", formId, e);
            generateAndSavePdf(form);
            return pdfStorageService.loadPdfFromFileSystem(form.getPdfFilePath());
        }
    }


    public List<MedicalForm> getAllMedicalFormsWithPdf() {
        List<MedicalForm> forms = medicalFormRepository.findAll();
        logger.info("Retrieved {} medical forms for admin", forms.size());
        return forms;
    }



    public List<MedicalForm> getAllMedicalForms() {
        return medicalFormRepository.findAll();

    }

    public List<MedicalForm> getMedicalFormsByDoctor(User doctor) {
        return medicalFormRepository.findByDoctor(doctor);
    }

    public List<MedicalForm> getActiveMedicalFormsByDoctor(User doctor) {

        List<FormStatus> activeStatuses = Arrays.asList(
            FormStatus.SUBMITTED,
            FormStatus.UNDER_REVIEW,
            FormStatus.REQUIRES_SUPERVISION
        );

        return medicalFormRepository.findByDoctorAndStatusIn(doctor, activeStatuses);
    }

    public List<MedicalForm> getCompletedMedicalFormsByDoctor(User doctor) {
        return medicalFormRepository.findByDoctorAndStatus(doctor, FormStatus.COMPLETED);
    }

    public Optional<MedicalForm> getFormById(Integer formId) {
        return medicalFormRepository.findById(formId);
    }

    public List<MedicalForm> getRecentMedicalFormsByDoctor(User doctor) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return medicalFormRepository.findByDoctorAndCreatedAtAfter(doctor, thirtyDaysAgo);
    }

    public boolean isFormCreatedByDoctor(Integer formId, User doctor) {
        Optional<MedicalForm> form = medicalFormRepository.findById(formId);
        if (form.isEmpty()) {
            return false;
        }

        return form.get().getDoctor().getUserId().equals(doctor.getUserId());
    }
}