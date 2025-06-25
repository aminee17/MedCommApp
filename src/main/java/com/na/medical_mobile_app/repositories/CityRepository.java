package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.City;
import com.na.medical_mobile_app.entities.Governorate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findByGovernorate(Governorate governorate);
    City findByName(String name);
    List<City> findByNameContainingIgnoreCase(String namePattern);
    List<City> findByGovernorateAndNameContainingIgnoreCase(Governorate governorate, String namePattern);
}