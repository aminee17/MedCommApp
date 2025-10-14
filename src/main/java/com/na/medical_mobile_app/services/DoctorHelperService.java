package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.DoctorCreationRequest;
import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DoctorHelperService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorHelperService.class);

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    //------------------------------------------Populating a doctor---------------------------------------------------------
    public void populateDoctorFields(User doctor, DoctorCreationRequest request) {
        // Use getter methods instead of direct field access
        doctor.setName(request.getName());
        doctor.setPhone(request.getPhone());
        doctor.setCin(request.getCin());
        
        // Convert String role to Role enum
        if (request.getRole() != null) {
            try {
                Role roleEnum = Role.valueOf(request.getRole().toUpperCase());
                doctor.setRole(roleEnum);
            } catch (IllegalArgumentException e) {
                doctor.setRole(Role.MEDECIN); // Default role
                logger.warn("Invalid role '{}', defaulting to MEDECIN", request.getRole());
            }
        } else {
            doctor.setRole(Role.MEDECIN); // Default role
        }
        
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmailVerifiedAt(null); // Later
        doctor.setHospitalAffiliation(request.getHospitalAffiliation());

        // Use getter methods for location
        this.setLocation(doctor, request.getGovernorateId(), request.getCityId());
    }
    
    //-------------------------------Making a good location & governorate ------------------------------------------------------
    public void setLocation(User user, Integer governorateId, Integer cityId) {
        logger.info("Setting location - Governorate ID: {}, City ID: {}", governorateId, cityId);
        
        if (governorateId != null) {
            logger.debug("Looking up governorate with ID: {}", governorateId);
            Governorate gov = governorateRepository.findById(governorateId)
                    .orElseThrow(() -> {
                        logger.error("Governorate not found with ID: {}", governorateId);
                        return new IllegalArgumentException("Gouvernorat introuvable avec l'ID: " + governorateId);
                    });
            user.setGovernorate(gov);
            logger.debug("Governorate set: {}", gov.getName());
        } else {
            logger.warn("Governorate ID is null");
        }

        if (cityId != null) {
            logger.debug("Looking up city with ID: {}", cityId);
            City city = cityRepository.findById(cityId)
                    .orElseThrow(() -> {
                        logger.error("City not found with ID: {}", cityId);
                        return new IllegalArgumentException("Ville introuvable avec l'ID: " + cityId);
                    });
            user.setCity(city);
            logger.debug("City set: {}", city.getName());
        } else {
            logger.warn("City ID is null");
        }
        
        logger.info("Location set successfully");
    }
}