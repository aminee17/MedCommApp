package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorHelperService {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;


//------------------------------------------Populating a doctor---------------------------------------------------------

    public void populateDoctorFields(User doctor, DoctorCreationRequest request) {
        doctor.setName(request.name);
        doctor.setPhone(request.phone);
        doctor.setCin(request.cin);
        doctor.setRole(request.role);
        doctor.setLicenseNumber(request.licenseNumber);
        doctor.setSpecialization(request.specialization);
        doctor.setEmailVerifiedAt(null);// Later
        doctor.setHospitalAffiliation(request.hospitalAffiliation);

        this.setLocation(doctor, request.getGovernorate_id(), request.getCity_id());

    }
    //-------------------------------Making a good location & governorate ------------------------------------------------------

    public void setLocation(User user, Integer governorateId, Integer cityId) {
        if (governorateId != null) {
            Governorate gov = governorateRepository.findById(governorateId)
                    .orElseThrow(() -> new RuntimeException("Governorate not found"));
            user.setGovernorate(gov);
        }

        if (cityId != null) {
            City city = cityRepository.findById(cityId)
                    .orElseThrow(() -> new RuntimeException("City not found"));
            user.setCity(city);
        }
    }
}



