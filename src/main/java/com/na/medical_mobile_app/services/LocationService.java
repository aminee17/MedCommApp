package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    public List<Governorate> getAllGovernorates() {
        return governorateRepository.findAll();
    }

    public List<City> getCitiesByGovernorate(Integer governorateId) {
        return cityRepository.findByGovernorateId(governorateId);
    }
}
