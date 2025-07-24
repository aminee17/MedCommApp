package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdminRegistrationRequest {
    public String name;
    public String email;
    public String password;
    public String phone;
    public Long cin;
    public Integer governorate_id;
    public Integer city_id;

}

