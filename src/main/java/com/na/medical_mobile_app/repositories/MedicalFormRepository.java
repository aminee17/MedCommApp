// repositories/MedicalFormRepository.java - COMPLETE CORRECTED VERSION
package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional; // ADD THIS IMPORT

@Repository
public interface MedicalFormRepository extends JpaRepository<MedicalForm, Integer> {
    List<MedicalForm> findByPatient(Patient patient);
    List<MedicalForm> findByDoctor(User doctor);
    List<MedicalForm> findByAssignedTo(User assignedTo);
    List<MedicalForm> findByStatus(FormStatus status);
    List<MedicalForm> findBySeizureFrequency(SeizureFrequency frequency);
    List<MedicalForm> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<MedicalForm> findByDateFirstSeizureBetween(LocalDate start, LocalDate end);
    List<MedicalForm> findByDateLastSeizureBetween(LocalDate start, LocalDate end);
    List<MedicalForm> findByTotalSeizuresGreaterThan(Integer count);
    List<MedicalForm> findByAverageSeizureDurationGreaterThan(Integer duration);
    List<MedicalForm> findByPatientAndStatus(Patient patient, FormStatus status);
    List<MedicalForm> findByDoctorAndStatus(User doctor, FormStatus status);
    List<MedicalForm> findByAssignedToAndStatus(User assignedTo, FormStatus status);
    List<MedicalForm> findByPatientOrderByCreatedAtDesc(Patient patient);
    List<MedicalForm> findByAssignedToAndStatusIn(User assignedTo, List<FormStatus> statuses);
    
    // New methods for filtering forms
    List<MedicalForm> findByDoctorAndStatusIn(User doctor, List<FormStatus> statuses);
    List<MedicalForm> findByDoctorAndCreatedAtAfter(User doctor, LocalDateTime date);
    List<MedicalForm> findByDoctorOrderByCreatedAtDesc(User doctor);
    
    // ADD THESE CRUCIAL METHODS:
    List<MedicalForm> findByAssignedToAndStatusNot(User assignedTo, FormStatus status);
    List<MedicalForm> findByAssignedToIsNullAndStatus(FormStatus status);
    
    // Add permission check method - FIXED VERSION
    @Query("SELECT m FROM MedicalForm m WHERE m.formId = ?1 AND (" +
           "m.doctor.userId = ?2 OR " +
           "m.assignedTo.userId = ?2 OR " +
           "?3 = 'ADMIN')")
    Optional<MedicalForm> findByIdWithPermission(Integer formId, Integer userId, String role);
}