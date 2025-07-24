package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.Governorate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovernorateRepository extends JpaRepository<Governorate, Integer> {
    Governorate findByName(String name);
    Governorate findByCode(String code);
    Optional<Governorate> findById(Integer governorate_id);
    List<Governorate> findByNameContainingIgnoreCase(String namePattern);
    List<Governorate> findByCodeContainingIgnoreCase(String codePattern);
}