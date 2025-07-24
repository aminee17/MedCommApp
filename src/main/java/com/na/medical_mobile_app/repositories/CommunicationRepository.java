package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.Communication;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Integer> {
    
    // Find all messages for a specific form
    List<Communication> findByFormOrderByCreatedAtAsc(MedicalForm form);
    
    // Find unread messages for a specific user
    List<Communication> findByReceiverAndIsReadFalse(User receiver);
    
    // Count unread messages for a specific user and form
    Integer countByReceiverAndFormAndIsReadFalse(User receiver, MedicalForm form);
    
    // Find unread messages for a specific user and form
    List<Communication> findByReceiverAndFormAndIsReadFalse(User receiver, MedicalForm form);
}