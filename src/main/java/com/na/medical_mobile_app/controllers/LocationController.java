package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import com.na.medical_mobile_app.repositories.CityRepository;
import com.na.medical_mobile_app.repositories.GovernorateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private GovernorateRepository governorateRepository;

    @Autowired
    private CityRepository cityRepository;

    @GetMapping("/governorates")
    public List<Governorate> getAllGovernorates() {
        return governorateRepository.findAll();
    }

    @GetMapping("/cities/{governorateId}")
    public List<City> getCitiesByGovernorate(@PathVariable Integer governorateId) {
        return cityRepository.findByGovernorateId(governorateId);
    }
}
