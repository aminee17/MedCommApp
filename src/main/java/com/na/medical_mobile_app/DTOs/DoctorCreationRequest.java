package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DoctorCreationRequest {

    public String name;
    public String email;
    public String phone;
    public Long cin;
    public Role role;
    public String licenseNumber;
    public Integer governorate_id;
    public Integer city_id;
    public String specialization;
    public String hospitalAffiliation;


}


