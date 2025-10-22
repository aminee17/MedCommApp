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
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        System.out.println("🔔 Getting notifications - userId param: " + userId + ", userId header: " + userIdHeader);
        
        // Get the current user - prioritize userId parameter/header over authentication
        User currentUser;
        if (userId != null) {
            System.out.println("Using userId parameter: " + userId);
            currentUser = userService.getUserById(userId);
        } else if (userIdHeader != null && !userIdHeader.isEmpty()) {
            System.out.println("Using userId header: " + userIdHeader);
            currentUser = userService.getUserById(Integer.parseInt(userIdHeader));
        } else {
            System.out.println("Falling back to getLoggedInUser()");
            currentUser = userService.getLoggedInUser();
        }
        
        System.out.println("🔔 Current user for notifications: " + currentUser.getUserId() + " - " + currentUser.getName() + " (" + currentUser.getRole() + ")");
        
        List<Notification> notifications = notificationService.getUserNotifications(currentUser);
        System.out.println("🔔 Found " + notifications.size() + " notifications for user " + currentUser.getName());
        
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications for the current user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        // Get the current user - prioritize userId parameter/header over authentication
        User currentUser;
        if (userId != null) {
            currentUser = userService.getUserById(userId);
        } else if (userIdHeader != null && !userIdHeader.isEmpty()) {
            currentUser = userService.getUserById(Integer.parseInt(userIdHeader));
        } else {
            currentUser = userService.getLoggedInUser();
        }
        
        List<Notification> notifications = notificationService.getUnreadNotifications(currentUser);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Count unread notifications for the current user
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> countUnreadNotifications(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        System.out.println("🔔 Counting notifications - userId param: " + userId + ", userId header: " + userIdHeader);
        
        // Get the current user - prioritize userId parameter/header over authentication
        User currentUser;
        if (userId != null) {
            System.out.println("Using userId parameter: " + userId);
            currentUser = userService.getUserById(userId);
        } else if (userIdHeader != null && !userIdHeader.isEmpty()) {
            System.out.println("Using userId header: " + userIdHeader);
            currentUser = userService.getUserById(Integer.parseInt(userIdHeader));
        } else {
            System.out.println("Falling back to getLoggedInUser()");
            currentUser = userService.getLoggedInUser();
        }
        
        System.out.println("🔔 Current user for notification count: " + currentUser.getUserId() + " - " + currentUser.getName() + " (" + currentUser.getRole() + ")");
        
        Integer count = notificationService.countUnreadNotifications(currentUser);
        System.out.println("🔔 Unread notification count for " + currentUser.getName() + ": " + count);
        
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
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        // Get the current user - prioritize userId parameter/header over authentication
        User currentUser;
        if (userId != null) {
            currentUser = userService.getUserById(userId);
        } else if (userIdHeader != null && !userIdHeader.isEmpty()) {
            currentUser = userService.getUserById(Integer.parseInt(userIdHeader));
        } else {
            currentUser = userService.getLoggedInUser();
        }
        
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