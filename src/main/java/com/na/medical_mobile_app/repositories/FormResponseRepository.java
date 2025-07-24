package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.FormResponse;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormResponseRepository extends JpaRepository<FormResponse, Integer> {
    List<FormResponse> findByForm(MedicalForm form);
    List<FormResponse> findByResponder(User responder);
    Optional<FormResponse> findTopByFormOrderByCreatedAtDesc(MedicalForm form);
    boolean existsByForm(MedicalForm form);
}