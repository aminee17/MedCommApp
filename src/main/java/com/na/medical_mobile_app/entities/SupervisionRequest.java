package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "supervision_requests")
public class SupervisionRequest {

//--------------------------Attributes-----------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;
    @Enumerated(EnumType.STRING)
    private SupervisionStatus status;


    @Column(columnDefinition = "TEXT")
    private String supervisorNotes;

    @Enumerated(EnumType.STRING)
    private SupervisionDecision supervisorDecision;

    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    //--------------------Relationships------------------------------------
    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;

    @ManyToOne
    @JoinColumn(name = "form_response_id", nullable = false)
    private FormResponse formResponse;

    @ManyToOne
    @JoinColumn(name = "requesting_resident_id", nullable = false)
    private User requestingResident;

    @ManyToOne
    @JoinColumn(name = "requested_supervisor_id", nullable = false)
    private User requestedSupervisor;



    public SupervisionRequest() {}

    // Getters and Setters
    public Integer getRequestId() { return requestId; }
    public void setRequestId(Integer requestId) { this.requestId = requestId; }
    public Consultation getConsultation() { return consultation; }
    public void setConsultation(Consultation consultation) { this.consultation = consultation; }
    public FormResponse getFormResponse() { return formResponse; }
    public void setFormResponse(FormResponse formResponse) { this.formResponse = formResponse; }
    public User getRequestingResident() { return requestingResident; }
    public void setRequestingResident(User requestingResident) { this.requestingResident = requestingResident; }
    public User getRequestedSupervisor() { return requestedSupervisor; }
    public void setRequestedSupervisor(User requestedSupervisor) { this.requestedSupervisor = requestedSupervisor; }
    public SupervisionStatus getStatus() { return status; }
    public void setStatus(SupervisionStatus status) { this.status = status; }
    public String getSupervisorNotes() { return supervisorNotes; }
    public void setSupervisorNotes(String supervisorNotes) { this.supervisorNotes = supervisorNotes; }
    public SupervisionDecision getSupervisorDecision() { return supervisorDecision; }
    public void setSupervisorDecision(SupervisionDecision supervisorDecision) { this.supervisorDecision = supervisorDecision; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
