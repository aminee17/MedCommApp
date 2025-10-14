package com.na.medical_mobile_app.DTOs;


import com.na.medical_mobile_app.entities.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
public class DoctorCreationRequest {


    @JsonProperty("name")
    private String name;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("phone")
    private String phone;
    
    @JsonProperty("cin")
    private String cin;  // Changed from Long to String
    
    @JsonProperty("role")
    private String role; // Changed from Role enum to String
    
    @JsonProperty("licenseNumber")
    private String licenseNumber;
    
    @JsonProperty("governorate_id")
    private Integer governorateId;
    
    @JsonProperty("city_id")
    private Integer cityId;
    
    @JsonProperty("specialization")
    private String specialization;
    
    @JsonProperty("hospitalAffiliation")
    private String hospitalAffiliation;
    
    @JsonProperty("userId")
    private Integer userId;

    // Default constructor
    public DoctorCreationRequest() {}

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public Integer getGovernorateId() { return governorateId; }
    public void setGovernorateId(Integer governorateId) { this.governorateId = governorateId; }

    public Integer getCityId() { return cityId; }
    public void setCityId(Integer cityId) { this.cityId = cityId; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getHospitalAffiliation() { return hospitalAffiliation; }
    public void setHospitalAffiliation(String hospitalAffiliation) { this.hospitalAffiliation = hospitalAffiliation; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    @Override
    public String toString() {
        return "DoctorCreationRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", cin='" + cin + '\'' +
                ", role='" + role + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", governorateId=" + governorateId +
                ", cityId=" + cityId +
                ", specialization='" + specialization + '\'' +
                ", hospitalAffiliation='" + hospitalAffiliation + '\'' +
                ", userId=" + userId +
                '}';
    }
}