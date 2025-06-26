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
}