package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.DTOs.ChatMessageDTO;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.services.CommunicationService;
import com.na.medical_mobile_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private CommunicationService communicationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Send a new message
     */
    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestBody Map<String, Object> request,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            System.out.println("Received chat message request: " + request);
            System.out.println("userId param: " + userId);
            System.out.println("userId header: " + userIdHeader);
            
            // Get the current user
            User currentUser = userService.getLoggedInUser();
            System.out.println("Current user: " + currentUser.getUserId() + " - " + currentUser.getName());
            
            // Extract request parameters
            Integer formId = (Integer) request.get("formId");
            Integer senderId = currentUser.getUserId();
            Integer receiverId = request.get("receiverId") != null ? (Integer) request.get("receiverId") : null;
            String message = (String) request.get("message");
            String content = (String) request.get("content");
            
            System.out.println("Extracted parameters: formId=" + formId + ", senderId=" + senderId + ", receiverId=" + receiverId);
            System.out.println("Message: " + message);
            System.out.println("Content: " + content);
            
            // Use content if message is not provided
            if (message == null && content != null) {
                message = content;
                System.out.println("Using content as message: " + message);
            }
            
            // Send the message
            ChatMessageDTO chatMessage = communicationService.sendMessage(formId, senderId, receiverId, message);
            System.out.println("Message sent successfully: " + chatMessage.getMessageId());
            
            return ResponseEntity.ok(chatMessage);
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }
    
    /**
     * Get all messages for a form
     */
    @GetMapping("/messages/{formId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesForForm(
            @PathVariable Integer formId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            // Get the current user
            User currentUser = userService.getLoggedInUser();
            
            // Mark messages as read
            communicationService.markMessagesAsRead(formId, currentUser.getUserId());
            
            // Get messages
            List<ChatMessageDTO> messages = communicationService.getMessagesForForm(formId);
            
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get messages: " + e.getMessage());
        }
    }
    
    /**
     * Count unread messages for a form
     */
    @GetMapping("/unread-count/{formId}")
    public ResponseEntity<Map<String, Integer>> countUnreadMessagesForForm(
            @PathVariable Integer formId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            // Get the current user
            User currentUser = userService.getLoggedInUser();
            
            // Count unread messages
            Integer count = communicationService.countUnreadMessagesForForm(formId, currentUser.getUserId());
            
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to count unread messages: " + e.getMessage());
        }
    }
    
    /**
     * Send a voice message
     */
    @PostMapping("/send-voice")
    public ResponseEntity<ChatMessageDTO> sendVoiceMessage(
            @RequestParam("formId") Integer formId,
            @RequestParam(value = "receiverId", required = false) Integer receiverId,
            @RequestParam("audioFile") MultipartFile audioFile,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            // Get the current user
            User currentUser = userService.getLoggedInUser();
            
            // Send the voice message
            ChatMessageDTO voiceMessage = communicationService.sendVoiceMessage(
                formId, currentUser.getUserId(), receiverId, audioFile
            );
            
            return ResponseEntity.ok(voiceMessage);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send voice message: " + e.getMessage());
        }
    }
    
    /**
     * Get audio file for a voice message
     */
    @GetMapping("/audio/{messageId}")
    public ResponseEntity<org.springframework.core.io.Resource> getAudioFile(
            @PathVariable Integer messageId,
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = "userId", required = false) String userIdHeader
    ) {
        try {
            return communicationService.getAudioFile(messageId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get audio file: " + e.getMessage());
        }
    }
}