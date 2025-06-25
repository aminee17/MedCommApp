package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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
    private String location;
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

    @Setter
    @ManyToOne
    @JoinColumn(name = "governorate_id")
    private Governorate governorate;

    @Setter
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;


    public User() {
        // Default constructor
    }


    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }


}