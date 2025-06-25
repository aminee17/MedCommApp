package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.Governorate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GovernorateRepository extends JpaRepository<Governorate, Integer> {
    Governorate findByName(String name);
    Governorate findByCode(String code);
    List<Governorate> findByNameContainingIgnoreCase(String namePattern);
    List<Governorate> findByCodeContainingIgnoreCase(String codePattern);
}