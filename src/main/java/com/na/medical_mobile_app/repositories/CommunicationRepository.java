package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.Communication;
import com.na.medical_mobile_app.entities.Consultation;
import com.na.medical_mobile_app.entities.MessageType;
import com.na.medical_mobile_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Integer> {
    List<Communication> findByConsultation(Consultation consultation);
    List<Communication> findBySender(User sender);
    List<Communication> findByReceiver(User receiver);
    List<Communication> findByMessageType(MessageType messageType);
    List<Communication> findByIsRead(Boolean isRead);
    List<Communication> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Communication> findByReplyTo(Communication replyTo);
    List<Communication> findBySenderAndReceiver(User sender, User receiver);
    List<Communication> findByConsultationAndMessageType(Consultation consultation, MessageType messageType);
    List<Communication> findByReceiverAndIsRead(User receiver, Boolean isRead);
}