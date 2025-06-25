package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupervisionRequestRepository extends JpaRepository<SupervisionRequest, Integer> {
    List<SupervisionRequest> findByConsultation(Consultation consultation);
    List<SupervisionRequest> findByFormResponse(FormResponse formResponse);
    List<SupervisionRequest> findByRequestingResident(User requestingResident);
    List<SupervisionRequest> findByRequestedSupervisor(User requestedSupervisor);
    List<SupervisionRequest> findByStatus(SupervisionStatus status);
    List<SupervisionRequest> findBySupervisorDecision(SupervisionDecision decision);
    List<SupervisionRequest> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<SupervisionRequest> findByReviewedAtBetween(LocalDateTime start, LocalDateTime end);
    List<SupervisionRequest> findByRequestedSupervisorAndStatus(User requestedSupervisor, SupervisionStatus status);
    List<SupervisionRequest> findByRequestingResidentAndStatus(User requestingResident, SupervisionStatus status);
    List<SupervisionRequest> findByConsultationAndStatus(Consultation consultation, SupervisionStatus status);
}