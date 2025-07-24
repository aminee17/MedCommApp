package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalFormRepository medicalFormRepository;
    
    @Autowired
    private GovernorateRepository governorateRepository;
    
    @Autowired
    private CityRepository cityRepository;

    public Patient findOrCreatePatient(MedicalFormRequest request) {
        Patient patient = patientRepository.findByCin(request.cinNumber);
        if (patient == null) {
            patient = new Patient();
            patient.setCin(request.cinNumber);
            patient.setName(request.fullName);
            patient.setBirthdate(request.birthDate);
            patient.setGender(request.gender);
            patient.setAddress(request.address);
            patient.setPhone(request.phoneNumber);
            
            // Set governorate and city using their IDs
            if (request.governorate_id != null) {
                Governorate governorate = governorateRepository.findById(request.governorate_id)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid governorate ID"));
                patient.setGovernorate(governorate);
            }
            
            if (request.city_id != null) {
                City city = cityRepository.findById(request.city_id)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid city ID"));
                patient.setCity(city);
            }
            
            patient.setCreatedAt(LocalDateTime.now());
            return patientRepository.save(patient);
        } else {
            // Update request with existing patient data
            request.fullName = patient.getName();
            request.birthDate = patient.getBirthdate();
            request.gender = patient.getGender();
            request.address = patient.getAddress();
            request.phoneNumber = patient.getPhone();
            request.governorate_id = patient.getGovernorate() != null ? patient.getGovernorate().getId() : null;
            request.city_id = patient.getCity() != null ? patient.getCity().getId() : null;
            patient.setUpdatedAt(LocalDateTime.now());

            MedicalForm latestForm = medicalFormRepository.findByPatientOrderByCreatedAtDesc(patient)
                    .stream().findFirst().orElse(null);
            if (latestForm != null) {
                request.firstSeizureDate = latestForm.getDateFirstSeizure();
                request.lastSeizureDate = latestForm.getDateLastSeizure();
                request.totalSeizures = latestForm.getTotalSeizures();
            }
            return patient;
        }
    }

    public Integer calculateAge(LocalDate birthdate) {
        if (birthdate == null) return null;
        return Period.between(birthdate, LocalDate.now()).getYears();
    }
}