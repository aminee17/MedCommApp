package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;



@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String name;
    private String email;
    private String phone;
    private Long cin;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;


    private String specialization;
    private String hospitalAffiliation;
    private String licenseNumber;
    private Boolean isActive;
    private LocalDateTime emailVerifiedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

//------------------------------Relationships--------------------------------
    @OneToMany(mappedBy = "referringDoctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patients;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<MedicalForm> medicalForms;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<MedicalForm> assignedForms;

    @OneToMany(mappedBy = "responder", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FormResponse> formResponses;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Consultation> assignedConsultations;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Communication> sentCommunications;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Communication> receivedCommunications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Notification> notifications;


    @ManyToOne
    @JoinColumn(name = "governorate_id")
    private Governorate governorate; //yaani fin ye5dem houa tawa


    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

//------------------------------------setters & getters --------------------------------------------------------------
    public List<Communication> getReceivedCommunications() {
        return receivedCommunications;
    }

    public void setReceivedCommunications(List<Communication> receivedCommunications) {
        this.receivedCommunications = receivedCommunications;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public Governorate getGovernorate() {
        return governorate;
    }

    public void setGovernorate(Governorate governorate) {
        this.governorate = governorate;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public void setName(String systemUser) {
        this.name=systemUser;
    }
    public String getName() {
        return name;
    }
    public void setEmail(String systemUser) {
        this.email=systemUser;
    }
    public String getEmail() {
        return email;
    }
    public void setPhone(String systemUser) {
        this.phone=systemUser;
    }
    public String getPhone() {
        return phone;
    }
    public void setCin(Long systemUser) {
        this.cin=systemUser;
    }
    public Long getCin() {
        return cin;
    }
    public void setPassword(String systemUser) {
        this.password=systemUser;
    }
    public String getPassword() {
        return password;
    }
    public void setRole(Role systemUser) {
        this.role=systemUser;
    }
    public Role getRole() {
        return role;
    }
    public void setSpecialization(String systemUser) {
        this.specialization=systemUser;
    }
    public String getSpecialization() {
        return specialization;
    }
    public void setHospitalAffiliation(String systemUser) {
        this.hospitalAffiliation=systemUser;
    }
    public String getHospitalAffiliation() {
        return hospitalAffiliation;
    }
    public void setLicenseNumber(String systemUser) {
        this.licenseNumber=systemUser;
    }
    public String getLicenseNumber() {
        return licenseNumber;
    }
    public void setIsActive(Boolean systemUser) {
        this.isActive=systemUser;
    }
    public Boolean getIsActive() {
        return isActive;
    }
    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }
    public void setEmailVerifiedAt(LocalDateTime systemUser) {
        this.emailVerifiedAt=systemUser;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime systemUser) {
        this.createdAt=systemUser;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime systemUser) {
        this.updatedAt=systemUser;
    }
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public List<Patient> getPatients() {
        return patients;
    }
    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }
    public List<MedicalForm> getMedicalForms() {
        return medicalForms;
    }
    public void setMedicalForms(List<MedicalForm> medicalForms) {
        this.medicalForms = medicalForms;
    }
    public List<MedicalForm> getAssignedForms() {
        return assignedForms;
    }
    public void setAssignedForms(List<MedicalForm> assignedForms) {
        this.assignedForms = assignedForms;
    }
    public List<FormResponse> getFormResponses() {
        return formResponses;
    }
    public void setFormResponses(List<FormResponse> formResponses) {
        this.formResponses = formResponses;
    }
    public List<Consultation> getAssignedConsultations() {
        return assignedConsultations;
    }
    public void setAssignedConsultations(List<Consultation> assignedConsultations) {
        this.assignedConsultations = assignedConsultations;
    }
    public List<Communication> getSentCommunications() {
        return sentCommunications;
    }
    public void setSentCommunications(List<Communication> sentCommunications) {
        this.sentCommunications = sentCommunications;
    }


}



