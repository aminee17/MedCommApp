package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.ChatMessageDTO;
import com.na.medical_mobile_app.entities.Communication;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.MessageType;
import com.na.medical_mobile_app.entities.NotificationType;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;

import java.util.List;
import com.na.medical_mobile_app.repositories.CommunicationRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CommunicationService {

    @Autowired
    private CommunicationRepository communicationRepository;
    
    @Autowired
    private MedicalFormRepository medicalFormRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Send a new message
     */
    public ChatMessageDTO sendMessage(Integer formId, Integer senderId, Integer receiverId, String message) {
        System.out.println("CommunicationService.sendMessage called with: formId=" + formId + ", senderId=" + senderId + ", receiverId=" + receiverId);
        System.out.println("Message content: " + message);
        
        // Validate inputs
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));
        System.out.println("Found form: " + form.getFormId());
                
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found with ID: " + senderId));
        System.out.println("Found sender: " + sender.getName());
        
        User receiver;
        if (receiverId != null) {
            receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found with ID: " + receiverId));
        } else {
            // If receiverId is null, find the appropriate receiver based on the form
            if (form.getAssignedTo() != null) {
                // If the form is assigned to a neurologist, use that
                receiver = form.getAssignedTo();
            } else if (sender.getRole().toString().equals("MEDECIN")) {
                // If sender is a doctor, find a neurologist
                receiver = userRepository.findFirstByRoleIn(List.of(Role.NEUROLOGUE, Role.NEUROLOGUE_RESIDENT))
                        .orElseThrow(() -> new RuntimeException("No neurologist found in the system"));
            } else {
                // If sender is a neurologist, use the doctor who created the form
                receiver = form.getDoctor();
            }
        }
        System.out.println("Found receiver: " + receiver.getName());
        
        // Create and save the communication
        Communication communication = new Communication();
        communication.setForm(form);
        communication.setSender(sender);
        communication.setReceiver(receiver);
        communication.setContent(message);
        communication.setMessageType(MessageType.TEXT);
        communication.setCreatedAt(LocalDateTime.now());
        communication.setIsRead(false);
        
        System.out.println("Saving communication entity...");
        Communication savedCommunication = communicationRepository.save(communication);
        System.out.println("Saved communication with ID: " + savedCommunication.getCommunicationId());
        
        // Create notification for the receiver
        System.out.println("Creating notification...");
        notificationService.createChatNotification(savedCommunication);
        
        // Convert to DTO and return
        ChatMessageDTO dto = convertToDTO(savedCommunication);
        System.out.println("Returning DTO with ID: " + dto.getMessageId());
        return dto;
    }
    
    /**
     * Get all messages for a form
     */
    public List<ChatMessageDTO> getMessagesForForm(Integer formId) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));
                
        List<Communication> communications = communicationRepository.findByFormOrderByCreatedAtAsc(form);
        
        List<ChatMessageDTO> chatMessages = new ArrayList<>();
        for (Communication communication : communications) {
            chatMessages.add(convertToDTO(communication));
        }
        
        return chatMessages;
    }
    
    /**
     * Mark messages as read
     */
    public void markMessagesAsRead(Integer formId, Integer userId) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
                
        List<Communication> communications = communicationRepository.findByFormOrderByCreatedAtAsc(form);
        
        for (Communication communication : communications) {
            if (communication.getReceiver().getUserId().equals(userId) && !communication.getIsRead()) {
                communication.setIsRead(true);
            }
        }
        
        communicationRepository.saveAll(communications);
    }
    
    /**
     * Count unread messages for a form and user
     */
    public Integer countUnreadMessagesForForm(Integer formId, Integer userId) {
        MedicalForm form = medicalFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found with ID: " + formId));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
                
        return communicationRepository.countByReceiverAndFormAndIsReadFalse(user, form);
    }
    
    /**
     * Convert Communication entity to ChatMessageDTO
     */
    private ChatMessageDTO convertToDTO(Communication communication) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setMessageId(communication.getCommunicationId());
        dto.setFormId(communication.getForm().getFormId());
        dto.setSenderId(communication.getSender().getUserId());
        dto.setSenderName(communication.getSender().getName());
        dto.setSenderRole(communication.getSender().getRole().toString());
        dto.setReceiverId(communication.getReceiver().getUserId());
        dto.setReceiverName(communication.getReceiver().getName());
        dto.setMessage(communication.getContent());
        dto.setTimestamp(communication.getCreatedAt());
        dto.setIsRead(communication.getIsRead());
        
        // Set additional fields if available
        if (communication.getMessageType() != null) {
            dto.setMessageType(communication.getMessageType().toString());
        }
        
        if (communication.getFilePath() != null) {
            dto.setFilePath(communication.getFilePath());
        }
        
        // Set reply to ID if present
        if (communication.getReplyTo() != null) {
            dto.setReplyToId(communication.getReplyTo().getCommunicationId());
        }
        
        return dto;
    }
}