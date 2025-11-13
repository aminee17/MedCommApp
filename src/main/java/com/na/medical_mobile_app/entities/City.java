package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cities")
public class City implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Keep this for cities
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "governorate_id", nullable = false)
    private Governorate governorate;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patients;


    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users;

    // Constructors
    public City() {
    }

    public City(String name, Governorate governorate) {
        this.name = name;
        this.governorate = governorate;
        this.createdAt = LocalDateTime.now();
    }

    public City(String name, Governorate governorate, LocalDateTime createdAt) {
        this.name = name;
        this.governorate = governorate;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Governorate getGovernorate() { return governorate; }
    public void setGovernorate(Governorate governorate) { this.governorate = governorate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Patient> getPatients() { return patients; }
    public void setPatients(List<Patient> patients) { this.patients = patients; }
    
    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }

    @Override
    public String toString() {
        return "City{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", governorate=" + (governorate != null ? governorate.getName() : "null") +
                '}';
    }
}