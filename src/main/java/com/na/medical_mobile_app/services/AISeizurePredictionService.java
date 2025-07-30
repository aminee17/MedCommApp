package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.AIAnalysisRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AISeizurePredictionService {

    @Autowired
    private AIAnalysisRepository aiAnalysisRepository;
    
    @Autowired
    private MedicalFormRepository medicalFormRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIAnalysis predictSeizureRisk(Patient patient) {
        try {
            List<MedicalForm> patientForms = medicalFormRepository.findByPatient(patient);
            
            if (patientForms.isEmpty()) {
                return createLowRiskAnalysis(patient, "Insufficient data for prediction");
            }

            // Calculate risk factors
            Map<String, Object> riskFactors = calculateRiskFactors(patientForms, patient);
            float riskScore = calculateRiskScore(riskFactors);
            String riskLevel = determineRiskLevel(riskScore);
            List<String> recommendations = generateRecommendations(riskFactors, riskLevel);

            // Create analysis results
            Map<String, Object> results = new HashMap<>();
            results.put("riskScore", riskScore);
            results.put("riskLevel", riskLevel);
            results.put("riskFactors", riskFactors);
            results.put("patientAge", calculateAge(patient));
            results.put("totalForms", patientForms.size());

            AIAnalysis analysis = new AIAnalysis();
            analysis.setPatient(patient);
            analysis.setAnalysisType("SEIZURE_RISK_PREDICTION");
            analysis.setDataSource("MEDICAL_FORMS");
            analysis.setResults(objectMapper.writeValueAsString(results));
            analysis.setConfidenceScore(riskScore);
            analysis.setRecommendations(String.join("; ", recommendations));
            analysis.setCreatedAt(LocalDateTime.now());

            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            return createErrorAnalysis(patient, "Error in prediction: " + e.getMessage());
        }
    }

    private Map<String, Object> calculateRiskFactors(List<MedicalForm> forms, Patient patient) {
        Map<String, Object> factors = new HashMap<>();
        
        // Get most recent form
        MedicalForm recentForm = forms.stream()
            .max(Comparator.comparing(MedicalForm::getCreatedAt))
            .orElse(null);

        if (recentForm != null) {
            // Seizure frequency analysis
            factors.put("seizureFrequency", recentForm.getSeizureFrequency());
            factors.put("totalSeizures", recentForm.getTotalSeizures() != null ? recentForm.getTotalSeizures() : 0);
            factors.put("averageDuration", recentForm.getAverageSeizureDuration() != null ? recentForm.getAverageSeizureDuration() : 0);
            
            // Time since last seizure
            if (recentForm.getDateLastSeizure() != null) {
                long daysSinceLastSeizure = ChronoUnit.DAYS.between(recentForm.getDateLastSeizure(), LocalDateTime.now());
                factors.put("daysSinceLastSeizure", daysSinceLastSeizure);
            }
            
            // Symptom analysis
            factors.put("hasSymptoms", recentForm.getSymptoms() != null && !recentForm.getSymptoms().trim().isEmpty());
            factors.put("symptomComplexity", analyzeSymptomComplexity(recentForm.getSymptoms()));
        }

        // Patient demographics
        factors.put("patientAge", calculateAge(patient));
        factors.put("gender", patient.getGender());
        factors.put("formCount", forms.size());
        
        return factors;
    }

    private float calculateRiskScore(Map<String, Object> factors) {
        float score = 0.0f;
        
        // Seizure frequency weight (40%)
        SeizureFrequency frequency = (SeizureFrequency) factors.get("seizureFrequency");
        if (frequency != null) {
            switch (frequency) {
                case DAILY: score += 0.4f; break;
                case WEEKLY: score += 0.3f; break;
                case MONTHLY: score += 0.2f; break;
                case RARELY: score += 0.1f; break;
            }
        }
        
        // Days since last seizure (20%)
        Long daysSince = (Long) factors.get("daysSinceLastSeizure");
        if (daysSince != null) {
            if (daysSince < 7) score += 0.2f;
            else if (daysSince < 30) score += 0.15f;
            else if (daysSince < 90) score += 0.1f;
            else score += 0.05f;
        }
        
        // Total seizures (20%)
        Integer totalSeizures = (Integer) factors.get("totalSeizures");
        if (totalSeizures != null && totalSeizures > 0) {
            if (totalSeizures > 50) score += 0.2f;
            else if (totalSeizures > 20) score += 0.15f;
            else if (totalSeizures > 5) score += 0.1f;
            else score += 0.05f;
        }
        
        // Symptom complexity (10%)
        Integer complexity = (Integer) factors.get("symptomComplexity");
        if (complexity != null) {
            score += (complexity / 10.0f) * 0.1f;
        }
        
        // Age factor (10%)
        Integer age = (Integer) factors.get("patientAge");
        if (age != null) {
            if (age < 18 || age > 65) score += 0.1f;
            else score += 0.05f;
        }
        
        return Math.min(score, 1.0f);
    }

    private String determineRiskLevel(float score) {
        if (score >= 0.7f) return "HIGH";
        else if (score >= 0.4f) return "MEDIUM";
        else return "LOW";
    }

    private List<String> generateRecommendations(Map<String, Object> factors, String riskLevel) {
        List<String> recommendations = new ArrayList<>();
        
        switch (riskLevel) {
            case "HIGH":
                recommendations.add("Immediate neurologist consultation recommended");
                recommendations.add("Consider medication adjustment");
                recommendations.add("Implement strict seizure monitoring");
                break;
            case "MEDIUM":
                recommendations.add("Schedule follow-up within 2 weeks");
                recommendations.add("Monitor seizure patterns closely");
                recommendations.add("Review current treatment plan");
                break;
            case "LOW":
                recommendations.add("Continue current treatment");
                recommendations.add("Regular monitoring recommended");
                recommendations.add("Maintain seizure diary");
                break;
        }
        
        // Additional specific recommendations
        Long daysSince = (Long) factors.get("daysSinceLastSeizure");
        if (daysSince != null && daysSince < 7) {
            recommendations.add("Recent seizure activity - increase monitoring");
        }
        
        Boolean hasSymptoms = (Boolean) factors.get("hasSymptoms");
        if (hasSymptoms != null && hasSymptoms) {
            recommendations.add("Document and analyze current symptoms");
        }
        
        return recommendations;
    }

    private Integer calculateAge(Patient patient) {
        if (patient.getBirthdate() != null) {
            return (int) ChronoUnit.YEARS.between(patient.getBirthdate(), LocalDateTime.now());
        }
        return null;
    }

    private Integer analyzeSymptomComplexity(String symptoms) {
        if (symptoms == null || symptoms.trim().isEmpty()) return 0;
        
        String[] keywords = {"headache", "nausea", "confusion", "memory", "vision", "speech", "weakness", "numbness"};
        int complexity = 0;
        String lowerSymptoms = symptoms.toLowerCase();
        
        for (String keyword : keywords) {
            if (lowerSymptoms.contains(keyword)) complexity++;
        }
        
        return Math.min(complexity, 10);
    }

    private AIAnalysis createLowRiskAnalysis(Patient patient, String reason) {
        try {
            Map<String, Object> results = new HashMap<>();
            results.put("riskScore", 0.1f);
            results.put("riskLevel", "LOW");
            results.put("reason", reason);

            AIAnalysis analysis = new AIAnalysis();
            analysis.setPatient(patient);
            analysis.setAnalysisType("SEIZURE_RISK_PREDICTION");
            analysis.setDataSource("MEDICAL_FORMS");
            analysis.setResults(objectMapper.writeValueAsString(results));
            analysis.setConfidenceScore(0.1f);
            analysis.setRecommendations("Collect more patient data for better prediction accuracy");
            analysis.setCreatedAt(LocalDateTime.now());

            return aiAnalysisRepository.save(analysis);
        } catch (Exception e) {
            return createErrorAnalysis(patient, "Failed to create low risk analysis");
        }
    }

    private AIAnalysis createErrorAnalysis(Patient patient, String error) {
        AIAnalysis analysis = new AIAnalysis();
        analysis.setPatient(patient);
        analysis.setAnalysisType("SEIZURE_RISK_PREDICTION");
        analysis.setDataSource("ERROR");
        analysis.setResults("{\"error\":\"" + error + "\"}");
        analysis.setConfidenceScore(0.0f);
        analysis.setRecommendations("Manual review required");
        analysis.setCreatedAt(LocalDateTime.now());
        
        return aiAnalysisRepository.save(analysis);
    }

    public List<AIAnalysis> getPatientPredictions(Patient patient) {
        return aiAnalysisRepository.findByPatientAndAnalysisType(patient, "SEIZURE_RISK_PREDICTION");
    }

    public List<AIAnalysis> getRecentHighRiskPredictions() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return aiAnalysisRepository.findByCreatedAtBetween(oneWeekAgo, LocalDateTime.now())
            .stream()
            .filter(analysis -> analysis.getConfidenceScore() >= 0.7f)
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(10)
            .toList();
    }
}