package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "consultations")
public class Consultation implements Serializable {
//----------------------------Attributes------------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer consultationId;

    @Enumerated(EnumType.STRING)
    private ConsultationStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(columnDefinition = "TEXT")
    private String finalDiagnosis;

    @Column(columnDefinition = "TEXT")
    private String finalRecommendations;

    // c'est à dire le neurologue trouve que le patient doit être transféré dans le centre c mieux.

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

//----------------------------Relationships-------------------------------------
    @OneToOne
    @JoinColumn(name = "form_id", nullable = false)
    private MedicalForm form;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "referring_doctor_id", nullable = false)
    private User referringDoctor;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SupervisionRequest> supervisionRequests;

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Communication> communications;

    public Consultation() {}

    // Getters and Setters
    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }
    public Integer getConsultationId() { return consultationId; }
    public void setConsultationId(Integer consultationId) { this.consultationId = consultationId; }
    public MedicalForm getForm() { return form; }
    public void setForm(MedicalForm form) { this.form = form; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getReferringDoctor() { return referringDoctor; }
    public void setReferringDoctor(User referringDoctor) { this.referringDoctor = referringDoctor; }
    public ConsultationStatus getStatus() { return status; }
    public void setStatus(ConsultationStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getFinalDiagnosis() { return finalDiagnosis; }
    public void setFinalDiagnosis(String finalDiagnosis) { this.finalDiagnosis = finalDiagnosis; }
    public String getFinalRecommendations() { return finalRecommendations; }
    public void setFinalRecommendations(String finalRecommendations) { this.finalRecommendations = finalRecommendations; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public List<SupervisionRequest> getSupervisionRequests() { return supervisionRequests; }
    public void setSupervisionRequests(List<SupervisionRequest> supervisionRequests) { this.supervisionRequests = supervisionRequests; }
    public List<Communication> getCommunications() { return communications; }
    public void setCommunications(List<Communication> communications) { this.communications = communications; }
}
