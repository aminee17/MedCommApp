package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUser(User user);
    List<Notification> findByNotificationType(NotificationType type);
    List<Notification> findByIsRead(Boolean isRead);
    List<Notification> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Notification> findByRelatedTypeAndRelatedId(String relatedType, Integer relatedId);
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);
    List<Notification> findByUserAndNotificationType(User user, NotificationType type);
    List<Notification> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);
    List<Notification> findByTitleContainingIgnoreCase(String titlePattern);
}