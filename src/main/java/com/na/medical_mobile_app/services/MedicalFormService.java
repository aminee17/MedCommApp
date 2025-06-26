package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.FileAttachmentRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.PatientRepository;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class MedicalFormService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalFormRepository medicalFormRepository;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;

    /**
     * Saves a medical form submission including patient information and attachments
     * @param request The form data containing all fields from the medical form
     * @return The ID of the saved form submission
     */
    @Transactional
    public Integer saveMedicalForm(MedicalFormRequest request) {
        if (request == null || request.cinNumber == null) {
            throw new IllegalArgumentException("Request and CIN number cannot be null");
        }

        // Find or create patient
        Patient patient = patientRepository.findByCin(request.cinNumber);
        if (patient == null) {
            patient = new Patient();
            patient.setCin(request.cinNumber);
            patient.setName(request.fullName);
            patient.setBirthdate(request.birthDate);
            patient.setGender(request.gender);
            patient.setAddress(request.address);
            patient.setPhone(request.phoneNumber);
            patient.setGovernorate(request.region);
            patient.setCity(request.city);
            patient = patientRepository.save(patient);
        } else {
            // Autofill the request with existing patient data
            request.fullName = patient.getName();
            request.birthDate = patient.getBirthdate();
            request.gender = patient.getGender();
            request.address = patient.getAddress();
            request.phoneNumber = patient.getPhone();
            request.region = patient.getGovernorate();
            request.city = patient.getCity();

            // Get latest form data
            MedicalForm latestForm = medicalFormRepository.findByPatientOrderByCreatedAtDesc(patient)
                    .stream().findFirst().orElse(null);
            if (latestForm != null) {
                request.firstSeizureDate = latestForm.getDateFirstSeizure();
                request.lastSeizureDate = latestForm.getDateLastSeizure();
                request.totalSeizures = latestForm.getTotalSeizures();
            }
        }

        // Create and save default user if needed
        User defaultUser = new User();
        defaultUser.setName("System User");
        defaultUser.setEmail("system@test.com");
        defaultUser.setRole(Role.MEDECIN);
        defaultUser.setCreatedAt(LocalDateTime.now());
        userRepository.save(defaultUser);

        User neurologue = new User();
        neurologue.setName("Neuro");
        neurologue.setEmail("syneurstem@test.com");
        neurologue.setRole(Role.NEUROLOGUE);
        neurologue.setCreatedAt(LocalDateTime.now());
        userRepository.save(neurologue);


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

        // Save the form first to get an ID
        medicalForm = medicalFormRepository.save(medicalForm);

        // Handle attachments
        List<FileAttachment> attachments = new ArrayList<>();

        if (request.mriPhoto != null && !request.mriPhoto.isEmpty()) {
            FileAttachment mriAttachment = new FileAttachment();
            mriAttachment.setForm(medicalForm);
            mriAttachment.setFileName("mri_photo.jpg");
            mriAttachment.setFilePath(request.mriPhoto);
            mriAttachment.setMimeType("image/jpeg");
            mriAttachment.setIsEncrypted(false);
            mriAttachment.setUploadedAt(LocalDateTime.now());
            mriAttachment.setFileSize(request.mrifileSize);
            mriAttachment.setUploadedBy(defaultUser);
            if (request.mrifileSize != null) {
                try {
                    mriAttachment.setFileSize(request.mrifileSize);
                } catch (Exception e) {
                    // If conversion fails, set a default size
                    mriAttachment.setFileSize(0L);
                }
            } else {
                mriAttachment.setFileSize(0L);
            }
            mriAttachment.setFileSize(request.mrifileSize);
            attachments.add(fileAttachmentRepository.save(mriAttachment));

        }

        if (request.seizureVideo != null && !request.seizureVideo.isEmpty()) {
            FileAttachment videoAttachment = new FileAttachment();
            videoAttachment.setForm(medicalForm);
            videoAttachment.setFileName("seizure_video.mp4");
            videoAttachment.setFilePath(request.seizureVideo);
            videoAttachment.setMimeType("video/mp4");
            videoAttachment.setIsEncrypted(false);
            videoAttachment.setUploadedAt(LocalDateTime.now());
            videoAttachment.setFileSize(request.videofileSize);

            if (request.videofileSize != null) {
                try {
                    videoAttachment.setFileSize(request.videofileSize);
                } catch (Exception e) {
                    // If conversion fails, set a default size
                    videoAttachment.setFileSize(0L);
                }
            } else {
                videoAttachment.setFileSize(0L);
            }
            videoAttachment.setUploadedBy(defaultUser);
            attachments.add(fileAttachmentRepository.save(videoAttachment));
        }

        // Update form with attachments
        medicalForm.setAttachments(attachments);
        medicalForm = medicalFormRepository.save(medicalForm);

        // Update patient's referring doctor
        patient.setReferringDoctor(defaultUser);
        patientRepository.save(patient);

        return medicalForm.getFormId();
    }


    // In MedicalFormService.java
    public List<MedicalForm> getAllMedicalForms() {
        return medicalFormRepository.findAll();
    }

}