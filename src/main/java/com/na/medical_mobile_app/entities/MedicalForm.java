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

    private Boolean isFirstSeizure;

    private Boolean hasAura;

    @Column(columnDefinition = "TEXT")
    private String auraDescription;

    private String mainSeizureType;

    @Column(columnDefinition = "TEXT")
    private String generalizedSeizureTypes;

    @Column(columnDefinition = "TEXT")
    private String focalSeizureTypes;

    @Column(columnDefinition = "TEXT")
    private String seizureOccurrenceDetails;

    private Boolean lossOfConsciousness;
    private Boolean progressiveFall;
    private Boolean suddenFall;
    private Boolean bodyStiffening;
    private Boolean clonicJerks;
    private Boolean automatisms;
    private Boolean eyeDeviation;
    private Boolean activityStop;
    private Boolean sensitiveDisorders;
    private Boolean sensoryDisorders;
    private Boolean incontinence;
    private Boolean lateralTongueBiting;

    @Column(columnDefinition = "TEXT")
    private String otherInformation;

    private LocalDate dateFirstSeizure;
    private LocalDate dateLastSeizure;
    private Integer totalSeizures;
    private Integer averageSeizureDuration;

    @Enumerated(EnumType.STRING)
    private SeizureFrequency seizureFrequency;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // PDF related fields
    @Column(name = "pdf_generated")
    private Boolean pdfGenerated = false;
    
    @Column(name = "pdf_generated_at")
    private LocalDateTime pdfGeneratedAt;
    
    @Column(name = "pdf_file_name")
    private String pdfFileName;
    
    @Column(name = "pdf_file_path")
    private String pdfFilePath;

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
    public Boolean getIsFirstSeizure() { return isFirstSeizure; }
    public void setIsFirstSeizure(Boolean isFirstSeizure) { this.isFirstSeizure = isFirstSeizure; }
    public Boolean getHasAura() { return hasAura; }
    public void setHasAura(Boolean hasAura) { this.hasAura = hasAura; }
    public String getAuraDescription() { return auraDescription; }
    public void setAuraDescription(String auraDescription) { this.auraDescription = auraDescription; }
    public String getMainSeizureType() { return mainSeizureType; }
    public void setMainSeizureType(String mainSeizureType) { this.mainSeizureType = mainSeizureType; }
    public String getGeneralizedSeizureTypes() { return generalizedSeizureTypes; }
    public void setGeneralizedSeizureTypes(String generalizedSeizureTypes) { this.generalizedSeizureTypes = generalizedSeizureTypes; }
    public String getFocalSeizureTypes() { return focalSeizureTypes; }
    public void setFocalSeizureTypes(String focalSeizureTypes) { this.focalSeizureTypes = focalSeizureTypes; }
    public String getSeizureOccurrenceDetails() { return seizureOccurrenceDetails; }
    public void setSeizureOccurrenceDetails(String seizureOccurrenceDetails) { this.seizureOccurrenceDetails = seizureOccurrenceDetails; }
    public Boolean getLossOfConsciousness() { return lossOfConsciousness; }
    public void setLossOfConsciousness(Boolean lossOfConsciousness) { this.lossOfConsciousness = lossOfConsciousness; }
    public Boolean getProgressiveFall() { return progressiveFall; }
    public void setProgressiveFall(Boolean progressiveFall) { this.progressiveFall = progressiveFall; }
    public Boolean getSuddenFall() { return suddenFall; }
    public void setSuddenFall(Boolean suddenFall) { this.suddenFall = suddenFall; }
    public Boolean getBodyStiffening() { return bodyStiffening; }
    public void setBodyStiffening(Boolean bodyStiffening) { this.bodyStiffening = bodyStiffening; }
    public Boolean getClonicJerks() { return clonicJerks; }
    public void setClonicJerks(Boolean clonicJerks) { this.clonicJerks = clonicJerks; }
    public Boolean getAutomatisms() { return automatisms; }
    public void setAutomatisms(Boolean automatisms) { this.automatisms = automatisms; }
    public Boolean getEyeDeviation() { return eyeDeviation; }
    public void setEyeDeviation(Boolean eyeDeviation) { this.eyeDeviation = eyeDeviation; }
    public Boolean getActivityStop() { return activityStop; }
    public void setActivityStop(Boolean activityStop) { this.activityStop = activityStop; }
    public Boolean getSensitiveDisorders() { return sensitiveDisorders; }
    public void setSensitiveDisorders(Boolean sensitiveDisorders) { this.sensitiveDisorders = sensitiveDisorders; }
    public Boolean getSensoryDisorders() { return sensoryDisorders; }
    public void setSensoryDisorders(Boolean sensoryDisorders) { this.sensoryDisorders = sensoryDisorders; }
    public Boolean getIncontinence() { return incontinence; }
    public void setIncontinence(Boolean incontinence) { this.incontinence = incontinence; }
    public Boolean getLateralTongueBiting() { return lateralTongueBiting; }
    public void setLateralTongueBiting(Boolean lateralTongueBiting) { this.lateralTongueBiting = lateralTongueBiting; }
    public String getOtherInformation() { return otherInformation; }
    public void setOtherInformation(String otherInformation) { this.otherInformation = otherInformation; }
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
    
    // PDF fields getters and setters
    public Boolean getPdfGenerated() { return pdfGenerated; }
    public void setPdfGenerated(Boolean pdfGenerated) { this.pdfGenerated = pdfGenerated; }
    
    public LocalDateTime getPdfGeneratedAt() { return pdfGeneratedAt; }
    public void setPdfGeneratedAt(LocalDateTime pdfGeneratedAt) { this.pdfGeneratedAt = pdfGeneratedAt; }
    
    public String getPdfFileName() { return pdfFileName; }
    public void setPdfFileName(String pdfFileName) { this.pdfFileName = pdfFileName; }
    
    public String getPdfFilePath() { return pdfFilePath; }
    public void setPdfFilePath(String pdfFilePath) { this.pdfFilePath = pdfFilePath; }
}