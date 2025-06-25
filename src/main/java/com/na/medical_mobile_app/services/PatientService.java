package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.Patient;
import com.na.medical_mobile_app.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    /**
     * Finds an existing patient by CIN or creates a new one if not found.
     *
     * @param requestPatient The patient data to search for or create.
     * @return The existing or newly created patient.
     */
    public Patient findOrCreatePatient(Patient requestPatient) {
        Optional<Patient> existing = Optional.ofNullable(patientRepository.findByCin(requestPatient.getCin()));

        return existing.orElseGet(() -> patientRepository.save(requestPatient));

    }
}
