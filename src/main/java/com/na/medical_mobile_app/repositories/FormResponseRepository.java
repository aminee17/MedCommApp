package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FormResponseRepository extends JpaRepository<FormResponse, Integer> {
    List<FormResponse> findByForm(MedicalForm form);
    List<FormResponse> findByResponder(User responder);
    List<FormResponse> findBySupervisionDoctor(User supervisionDoctor);
    List<FormResponse> findByResponseType(ResponseType responseType);
    List<FormResponse> findByRequiresSupervision(Boolean requiresSupervision);
    List<FormResponse> findByUrgencyLevel(UrgencyLevel urgencyLevel);
    List<FormResponse> findByFollowUpRequired(Boolean followUpRequired);
    List<FormResponse> findByFollowUpDate(LocalDate followUpDate);
    List<FormResponse> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<FormResponse> findByResponderAndCreatedAtBetween(User responder, LocalDateTime start, LocalDateTime end);
    List<FormResponse> findByFormAndResponseType(MedicalForm form, ResponseType responseType);
    List<FormResponse> findByFollowUpDateBetween(LocalDate start, LocalDate end);
    List<FormResponse> findByUrgencyLevelAndRequiresSupervision(UrgencyLevel urgencyLevel, Boolean requiresSupervision);
}