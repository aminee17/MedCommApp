package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.AIAnalysis;
import com.na.medical_mobile_app.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Integer> {
    List<AIAnalysis> findByPatient(Patient patient);
    List<AIAnalysis> findByAnalysisType(String analysisType);
    List<AIAnalysis> findByPatientAndAnalysisType(Patient patient, String analysisType);
    List<AIAnalysis> findByConfidenceScoreGreaterThan(Float threshold);
    List<AIAnalysis> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}