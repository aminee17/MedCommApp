package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Create a notification for a new form submission
     */
    public Notification createNewFormNotification(MedicalForm form) {
        User neurologist = form.getAssignedTo();
        
        Notification notification = new Notification();
        notification.setUser(neurologist);
        notification.setTitle("Nouveau formulaire médical");
        notification.setMessage("Un nouveau formulaire médical a été soumis par Dr. " + form.getDoctor().getName() + 
                " pour le patient " + form.getPatient().getName());
        notification.setNotificationType(NotificationType.NEW_FORM);
        notification.setRelatedId(form.getFormId());
        notification.setRelatedType("MEDICAL_FORM");
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    /**
     * Create a notification for a form response
     */
    public Notification createFormResponseNotification(FormResponse response) {
        MedicalForm form = response.getForm();
        User doctor = form.getDoctor();
        
        Notification notification = new Notification();
        notification.setUser(doctor);
        notification.setTitle("Réponse à votre formulaire");
        notification.setMessage("Dr. " + response.getResponder().getName() + 
                " a répondu à votre formulaire pour le patient " + form.getPatient().getName());
        notification.setNotificationType(NotificationType.UPDATE);
        notification.setRelatedId(form.getFormId());
        notification.setRelatedType("FORM_RESPONSE");
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
    }
    
    /**
     * Count unread notifications for a user
     */
    public Integer countUnreadNotifications(User user) {
        return notificationRepository.countUnreadNotifications(user);
    }
    
    /**
     * Mark a notification as read
     */
    public Notification markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Delete a notification
     */
    public void deleteNotification(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notificationRepository.delete(notification);
    }
    
    /**
     * Create a notification for a chat message
     */
    public Notification createChatNotification(Communication communication) {
        MedicalForm form = communication.getForm();
        User receiver = communication.getReceiver();
        User sender = communication.getSender();
        
        Notification notification = new Notification();
        notification.setUser(receiver);
        notification.setTitle("Nouveau message");
        notification.setMessage("Dr. " + sender.getName() + 
                " vous a envoyé un message concernant le patient " + form.getPatient().getName());
        notification.setNotificationType(NotificationType.ALERT);
        notification.setRelatedId(form.getFormId());
        notification.setRelatedType("CHAT");
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
}