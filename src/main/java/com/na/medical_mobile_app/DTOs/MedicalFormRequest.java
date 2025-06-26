package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Gender;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.SeizureFrequency;

import java.time.LocalDate;
import java.util.Map;

public class MedicalFormRequest {
    // Patient Info
    public String fullName;
    public LocalDate birthDate;
    public Gender gender;
    public Long cinNumber;
    public Governorate region;
    public City city;
    public String address;
    public String phoneNumber;

    // Seizure History
    public LocalDate firstSeizureDate;
    public LocalDate lastSeizureDate;
    public Boolean isFirstSeizure;
    public SeizureFrequency seizureFrequency;
    public Integer seizureDuration;
    public Integer totalSeizures;;

    // Characteristics
    public Boolean hasAura;
    public String auraDescription;
    public Map<String, Boolean> seizureTypes;

    // Symptoms
    public Boolean lossOfConsciousness;
    public Boolean bodyStiffening;
    public Boolean jerkingMovements;
    public Boolean eyeDeviation;
    public Boolean incontinence;
    public Boolean tongueBiting;
    public String tongueBitingLocation;

    // Miscellaneous
    public String otherInformation;
    public String mriPhoto;
    public String seizureVideo;
    public Long videofileSize;
    public Long mrifileSize;

}
