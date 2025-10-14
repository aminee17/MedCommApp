package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorCreationRequest {

    @JsonProperty("name")
    private String name;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("phone")
    private String phone;
    
    @JsonProperty("cin")
    private String cin;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("licenseNumber")
    private String licenseNumber;
    
    @JsonProperty("governorate_id")
    private Integer governorateId; // Note: changed from governorate_id to governorateId
    
    @JsonProperty("city_id")
    private Integer cityId; // Note: changed from city_id to cityId
    
    @JsonProperty("specialization")
    private String specialization;
    
    @JsonProperty("hospitalAffiliation")
    private String hospitalAffiliation;
    
    @JsonProperty("userId")
    private Integer userId;

    public DoctorCreationRequest() {}

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