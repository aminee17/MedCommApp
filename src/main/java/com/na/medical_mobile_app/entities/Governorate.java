package com.na.medical_mobile_app.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "governorates")
public class Governorate implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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

    public Governorate() {
    }

    @JsonCreator //A constructor to enable deserialization
    public Governorate(@JsonProperty("id") String id) {
        this.id = Integer.valueOf(id);
    }
    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setCities(List<City> cities) {
        this.cities = cities;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    public List<User> getUsers() {
        return this.users;
    }


    public Integer getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getCode() {
        return this.code;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public List<City> getCities() {
        return this.cities;
    }

    public List<Patient> getPatients() {
        return this.patients;
    }

}



