package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.ResponseType;
import com.na.medical_mobile_app.entities.UrgencyLevel;
import lombok.Data;

import java.time.LocalDate;

@Data
/*
this DTO focused only on what's needed from the frontend.
 responder is automatically filled from the authenticated user.
 created_at can be also filled outside of this DTO.
*/
public class FormResponseRequest {

    private Integer formId;
    private ResponseType responseType;
    private String diagnosis;
    private String recommendations;
    private String treatmentSuggestions;
    private String medicationChanges;
    private String followUpInstructions;
    private Boolean requiresSupervision;
    private Integer supervisionDoctorId;
    private UrgencyLevel urgencyLevel;
    private Boolean followUpRequired;
    private LocalDate followUpDate;
}
