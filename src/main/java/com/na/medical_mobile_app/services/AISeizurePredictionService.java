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
                return createLowRiskAnalysis(patient, "Données insuffisantes pour la prédiction");
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
            return createErrorAnalysis(patient, "Erreur dans la prédiction: " + e.getMessage());
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
                recommendations.add("Consultation neurologique immédiate recommandée");
                recommendations.add("Envisager un ajustement de la médication");
                recommendations.add("Mettre en place une surveillance stricte des crises");
                break;
            case "MEDIUM":
                recommendations.add("Programmer un suivi dans les 2 semaines");
                recommendations.add("Surveiller étroitement les patterns de crises");
                recommendations.add("Réviser le plan de traitement actuel");
                break;
            case "LOW":
                recommendations.add("Continuer le traitement actuel");
                recommendations.add("Surveillance régulière recommandée");
                recommendations.add("Maintenir un journal des crises");
                break;
        }
        
        // Additional specific recommendations
        Long daysSince = (Long) factors.get("daysSinceLastSeizure");
        if (daysSince != null && daysSince < 7) {
            recommendations.add("Activité de crise récente - augmenter la surveillance");
        }
        
        Boolean hasSymptoms = (Boolean) factors.get("hasSymptoms");
        if (hasSymptoms != null && hasSymptoms) {
            recommendations.add("Documenter et analyser les symptômes actuels");
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
            analysis.setRecommendations("Collecter plus de données patient pour une meilleure précision de prédiction");
            analysis.setCreatedAt(LocalDateTime.now());

            return aiAnalysisRepository.save(analysis);
        } catch (Exception e) {
            return createErrorAnalysis(patient, "Échec de création de l'analyse à faible risque");
        }
    }

    private AIAnalysis createErrorAnalysis(Patient patient, String error) {
        AIAnalysis analysis = new AIAnalysis();
        analysis.setPatient(patient);
        analysis.setAnalysisType("SEIZURE_RISK_PREDICTION");
        analysis.setDataSource("ERROR");
        analysis.setResults("{\"error\":\"" + error + "\"}");
        analysis.setConfidenceScore(0.0f);
        analysis.setRecommendations("Révision manuelle requise");
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