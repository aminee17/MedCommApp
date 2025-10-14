package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.entities.Notification;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.services.NotificationService;
import com.na.medical_mobile_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
// @CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Get all notifications for the current user
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        User currentUser = userService.getLoggedInUser();
        List<Notification> notifications = notificationService.getUserNotifications(currentUser);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications for the current user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        User currentUser = userService.getLoggedInUser();
        List<Notification> notifications = notificationService.getUnreadNotifications(currentUser);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Count unread notifications for the current user
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> countUnreadNotifications() {
        User currentUser = userService.getLoggedInUser();
        Integer count = notificationService.countUnreadNotifications(currentUser);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    /**
     * Mark a notification as read
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable("id") Integer notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }
    
    /**
     * Mark all notifications as read
     */
    @PostMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        User currentUser = userService.getLoggedInUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable("id") Integer notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }
}