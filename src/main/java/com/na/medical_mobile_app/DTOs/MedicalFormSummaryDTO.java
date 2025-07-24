package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class MedicalFormSummaryDTO {
    private Integer formId;
    private FormStatus status;
    private String symptoms; // Already built by buildSymptomsSummary()
    private LocalDate dateFirstSeizure;
    private LocalDate dateLastSeizure;
    private Integer totalSeizures;
    private Integer averageSeizureDuration;
    private SeizureFrequency seizureFrequency;
    private LocalDateTime createdAt;

    // Mini patient info
    private String patientName;
    private Long patientCin;
    private Integer patientAge;
    private Gender patientGender;

    // Referring doctor info
    private Integer referringDoctorId;
    private String referringDoctorName;
    private String referringDoctorEmail;
    private String referringDoctorPhone;
    private Role referringDoctorRole;
    private Governorate referringDoctorGovernorate;
    // Photos ( IRM + VIDEO) real ones seen by the doctor
    private List<String> attachmentUrls;



}



