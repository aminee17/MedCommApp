package com.na.medical_mobile_app.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "governorates")
public class Governorate implements Serializable {
    @Id
    private Integer id; // Remove @GeneratedValue since we're setting manual IDs

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 10)
    private String code;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "governorate", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<City> cities;

    @OneToMany(mappedBy = "governorate", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patients;

    @OneToMany(mappedBy = "governorate", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users;

    // Constructors
    public Governorate() {
    }

    public Governorate(Integer id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.createdAt = LocalDateTime.now();
    }

    public Governorate(Integer id, String name, String code, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<City> getCities() {
        return this.cities;
    }

    public void setCities(List<City> cities) {
        this.cities = cities;
    }

    public List<Patient> getPatients() {
        return this.patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    public List<User> getUsers() {
        return this.users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Governorate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}