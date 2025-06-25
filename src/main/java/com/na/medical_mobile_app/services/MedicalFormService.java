package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.FileAttachmentRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class MedicalFormService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalFormRepository medicalFormRepository;

    @Autowired
    private PatientService patientService;


    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;
    
    /**
     * Saves a medical form submission including patient information and attachments
     * @param request The form data containing all fields from the medical form
     * @return The ID of the saved form submission
     */
    public Integer saveMedicalForm(MedicalFormRequest request) {
//----------------------------------Patient Logic----------------------------------------------------------------------
            Patient patient = new Patient();
            patient.setCin(request.cinNumber);
            patient.setName(request.fullName);
            patient.setBirthdate(request.birthDate);
            patient.setGender(request.gender);
            patient.setAddress(request.address);
            patient.setPhone(request.phoneNumber);
            patient.setGovernorate(request.region);
            patient.setCity(request.city);

            // if the patient already exists, autofill his data fields
            patient = patientService.findOrCreatePatient(patient);

    //-----------------------------------Medical Form Logic------------------------------------------------------------
            MedicalForm medicalForm = new MedicalForm();
            medicalForm.setPatient(patient);
            medicalForm.setDateFirstSeizure(request.firstSeizureDate);
            medicalForm.setDateLastSeizure(request.lastSeizureDate);
            medicalForm.setTotalSeizures(request.totalSeizures);
            medicalForm.setAverageSeizureDuration(request.seizureDuration);
            medicalForm.setSeizureFrequency(request.seizureFrequency);
            medicalForm.setCreatedAt(LocalDateTime.now());
            medicalForm.setStatus(FormStatus.SUBMITTED);
            // The doctor who filled the form is still not set, it will be set later
            // The doctor who recieved the form is also not set, it will be set later


            // Extract seizure characteristics (new data & can't be autofilled)
            Boolean isFirstSeizure = request.isFirstSeizure;
            Boolean hasAura = request.hasAura;
            SeizureFrequency seizureFrequency = request.seizureFrequency;
            String auraDescription = request.auraDescription;
            Map<String, Boolean> seizureTypes = request.seizureTypes;
            Integer seizureDuration = request.seizureDuration;

            Boolean lossOfConsciousness = request.lossOfConsciousness;
            Boolean bodyStiffening = request.bodyStiffening;
            Boolean jerkingMovements = request.jerkingMovements;
            Boolean eyeDeviation = request.eyeDeviation;
            Boolean incontinence = request.incontinence;
            Boolean tongueBiting =request.tongueBiting;
            String tongueBitingLocation = request.tongueBitingLocation;

            // Extract additional information
            String otherInformation = request.otherInformation;

    // Concatenate fields like aura, other info, etc.
            String symptoms =
                    " Autre: " + otherInformation + " Première crise : " + isFirstSeizure
                    + " Fréquence des crises: " + seizureFrequency + " Durée moyenne des crises: "
                     + seizureDuration + " Aura: " + hasAura + " Description aura: "
                    + request.auraDescription;

            medicalForm.setSymptoms(symptoms);

    // Save the medical form
            medicalForm = medicalFormRepository.save(medicalForm);

    //-----------------------------------File Attachments Logic------------------------------------------------------------
            // Extract file attachments
            String mriPhotoUri = request.mriPhoto;
            String seizureVideoUri = request.seizureVideo;
            //we saved the path in the database/cloud then it will fetch for the actual image using that path.


            /* this is just a default user because
               uploaded by can't be null, this user is not even saved in the database
            * */
            User defaultUser = new User();
            defaultUser.setUserId(0);  // or any dummy ID you like
            defaultUser.setName("System User");
            defaultUser.setEmail("system@example.com");
            if (mriPhotoUri != null && !mriPhotoUri.isEmpty()) {
                FileAttachment mriAttachment = new FileAttachment();
                mriAttachment.setForm(medicalForm);
                mriAttachment.setFileName("mri_photo.jpg"); // Static or dynamic
                mriAttachment.setFilePath(mriPhotoUri);
                mriAttachment.setMimeType("image/jpeg");
                mriAttachment.setIsEncrypted(false); // just a flag; actual encryption not done here
                mriAttachment.setUploadedAt(LocalDateTime.now());
                mriAttachment.setUploadedBy(defaultUser);// passed from controller usually, this is just for testing purposes
                fileAttachmentRepository.save(mriAttachment);
            }

            if (seizureVideoUri != null && !seizureVideoUri.isEmpty()) {
                FileAttachment videoAttachment = new FileAttachment();
                videoAttachment.setForm(medicalForm);
                videoAttachment.setFileName("seizure_video.mp4");
                videoAttachment.setFilePath(seizureVideoUri);
                videoAttachment.setMimeType("video/mp4");
                videoAttachment.setIsEncrypted(false); // just a flag; actual encryption not done here
                videoAttachment.setUploadedAt(LocalDateTime.now());
                videoAttachment.setFileSize(request.fileSize); // Assuming fileSize is provided in request
                videoAttachment.setUploadedBy(defaultUser);
                fileAttachmentRepository.save(videoAttachment);
            }
            return medicalForm.getFormId(); // Replace with actual saved form ID

        }

}