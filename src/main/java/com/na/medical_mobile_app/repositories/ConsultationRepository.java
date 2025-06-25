package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {
    List<Consultation> findByPatient(Patient patient);
    List<Consultation> findByReferringDoctor(User referringDoctor);
    List<Consultation> findByAssignedTo(User assignedTo);
    List<Consultation> findByStatus(ConsultationStatus status);
    List<Consultation> findByPriority(Priority priority);
    List<Consultation> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Consultation> findByCompletedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Consultation> findByStatusAndPriority(ConsultationStatus status, Priority priority);
    List<Consultation> findByAssignedToAndStatus(User assignedTo, ConsultationStatus status);
    List<Consultation> findByPatientAndStatus(Patient patient, ConsultationStatus status);
    List<Consultation> findByForm(MedicalForm form);
}