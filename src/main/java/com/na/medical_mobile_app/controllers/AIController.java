package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.entities.AIAnalysis;
import com.na.medical_mobile_app.entities.Patient;
import com.na.medical_mobile_app.repositories.PatientRepository;
import com.na.medical_mobile_app.services.AISeizurePredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AISeizurePredictionService aiSeizurePredictionService;
    
    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/predict-seizure-risk/{patientId}")
    public ResponseEntity<?> predictSeizureRisk(@PathVariable Integer patientId) {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Patient not found");
            }

            AIAnalysis prediction = aiSeizurePredictionService.predictSeizureRisk(patientOpt.get());
            return ResponseEntity.ok(prediction);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating prediction: " + e.getMessage());
        }
    }

    @GetMapping("/patient-predictions/{patientId}")
    public ResponseEntity<?> getPatientPredictions(@PathVariable Integer patientId) {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Patient not found");
            }

            List<AIAnalysis> predictions = aiSeizurePredictionService.getPatientPredictions(patientOpt.get());
            return ResponseEntity.ok(predictions);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching predictions: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard-insights")
    public ResponseEntity<?> getDashboardInsights() {
        try {
            // Get recent high-risk predictions for dashboard
            List<AIAnalysis> recentAnalyses = aiSeizurePredictionService.getRecentHighRiskPredictions();
            return ResponseEntity.ok(recentAnalyses);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching insights: " + e.getMessage());
        }
    }
}