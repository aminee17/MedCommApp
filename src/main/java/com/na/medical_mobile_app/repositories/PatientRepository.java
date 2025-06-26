package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Patient findByCin(Long cin);
    List<Patient> findByReferringDoctor(User referringDoctor);
    List<Patient> findByGovernorate(Governorate governorate);
    List<Patient> findByCity(City city);
    List<Patient> findByGender(Gender gender);
    List<Patient> findByNameContainingIgnoreCase(String namePattern);
    List<Patient> findByBirthdate(LocalDate birthdate);
    List<Patient> findByBirthdateBetween(LocalDate start, LocalDate end);
    List<Patient> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Patient> findByPhone(String phone);
    List<Patient> findByEmergencyContactPhone(String phone);
    List<Patient> findByGovernorateAndCity(Governorate governorate, City city);
    List<Patient> findByReferringDoctorAndCreatedAtBetween(User referringDoctor, LocalDateTime start, LocalDateTime end);
}