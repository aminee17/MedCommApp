package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "medical_forms")
public class MedicalForm implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer formId;

    @Enumerated(EnumType.STRING)
    private FormStatus status;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    private LocalDate dateFirstSeizure;
    private LocalDate dateLastSeizure;
    private Integer totalSeizures;
    private Integer averageSeizureDuration;

    @Enumerated(EnumType.STRING)
    private SeizureFrequency seizureFrequency;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //Relationships
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;


    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FormResponse> responses;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FileAttachment> attachments;

    @OneToOne(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private Consultation consultation;

    public MedicalForm() {}

    // Getters and Setters
    public Integer getFormId() { return formId; }
    public void setFormId(Integer formId) { this.formId = formId; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public FormStatus getStatus() { return status; }
    public void setStatus(FormStatus status) { this.status = status; }
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public LocalDate getDateFirstSeizure() { return dateFirstSeizure; }
    public void setDateFirstSeizure(LocalDate dateFirstSeizure) { this.dateFirstSeizure = dateFirstSeizure; }
    public LocalDate getDateLastSeizure() { return dateLastSeizure; }
    public void setDateLastSeizure(LocalDate dateLastSeizure) { this.dateLastSeizure = dateLastSeizure; }
    public Integer getTotalSeizures() { return totalSeizures; }
    public void setTotalSeizures(Integer totalSeizures) { this.totalSeizures = totalSeizures; }
    public Integer getAverageSeizureDuration() { return averageSeizureDuration; }
    public void setAverageSeizureDuration(Integer averageSeizureDuration) { this.averageSeizureDuration = averageSeizureDuration; }
    public SeizureFrequency getSeizureFrequency() { return seizureFrequency; }
    public void setSeizureFrequency(SeizureFrequency seizureFrequency) { this.seizureFrequency = seizureFrequency; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<FormResponse> getResponses() { return responses; }
    public void setResponses(List<FormResponse> responses) { this.responses = responses; }
    public List<FileAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<FileAttachment> attachments) { this.attachments = attachments; }
    public Consultation getConsultation() { return consultation; }
    public void setConsultation(Consultation consultation) { this.consultation = consultation; }
}
