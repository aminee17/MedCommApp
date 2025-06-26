package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "form_responses")
public class FormResponse implements Serializable {
    //attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer responseId;

    @Enumerated(EnumType.STRING)
    private ResponseType responseType;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(columnDefinition = "TEXT")
    private String treatmentSuggestions;

    @Column(columnDefinition = "TEXT")
    private String medicationChanges;

    @Column(columnDefinition = "TEXT")
    private String followUpInstructions;

    private Boolean requiresSupervision;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel;

    private Boolean followUpRequired;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;

    // Relationships---------------------------------------------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    private MedicalForm form;

    @ManyToOne
    @JoinColumn(name = "responder_id", nullable = false)
    private User responder;

    @ManyToOne
    @JoinColumn(name = "supervision_doctor_id")
    private User supervisionDoctor;

    @OneToMany(mappedBy = "formResponse", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SupervisionRequest> supervisionRequests;

    public FormResponse() {}

    // Getters and Setters
    public Integer getResponseId() { return responseId; }
    public void setResponseId(Integer responseId) { this.responseId = responseId; }
    public MedicalForm getForm() { return form; }
    public void setForm(MedicalForm form) { this.form = form; }
    public User getResponder() { return responder; }
    public void setResponder(User responder) { this.responder = responder; }
    public ResponseType getResponseType() { return responseType; }
    public void setResponseType(ResponseType responseType) { this.responseType = responseType; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    public String getTreatmentSuggestions() { return treatmentSuggestions; }
    public void setTreatmentSuggestions(String treatmentSuggestions) { this.treatmentSuggestions = treatmentSuggestions; }
    public String getMedicationChanges() { return medicationChanges; }
    public void setMedicationChanges(String medicationChanges) { this.medicationChanges = medicationChanges; }
    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
    public Boolean getRequiresSupervision() { return requiresSupervision; }
    public void setRequiresSupervision(Boolean requiresSupervision) { this.requiresSupervision = requiresSupervision; }
    public User getSupervisionDoctor() { return supervisionDoctor; }
    public void setSupervisionDoctor(User supervisionDoctor) { this.supervisionDoctor = supervisionDoctor; }
    public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }
    public Boolean getFollowUpRequired() { return followUpRequired; }
    public void setFollowUpRequired(Boolean followUpRequired) { this.followUpRequired = followUpRequired; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<SupervisionRequest> getSupervisionRequests() { return supervisionRequests; }
    public void setSupervisionRequests(List<SupervisionRequest> supervisionRequests) { this.supervisionRequests = supervisionRequests; }
}
