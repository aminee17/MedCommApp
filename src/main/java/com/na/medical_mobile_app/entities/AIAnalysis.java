package com.na.medical_mobile_app.entities;


import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
public class AIAnalysis implements Serializable {
    //--------------------------Attributes--------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer analysisId;

    private String analysisType;
    private String dataSource;

    @Column(columnDefinition = "JSON")
    private String results;

    private Float confidenceScore;
    private String recommendations;

    private LocalDateTime createdAt;
    //-------------------------------Relationships--------------------------------
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;





    // Getters and setters
    public Integer getAnalysisId() { return analysisId; }
    public void setAnalysisId(Integer analysisId) { this.analysisId = analysisId; }
    public String getAnalysisType() { return analysisType; }
    public void setAnalysisType(String analysisType) { this.analysisType = analysisType; }
    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }
    public String getResults() { return results; }
    public void setResults(String results) { this.results = results; }
    public Float getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Float confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
}