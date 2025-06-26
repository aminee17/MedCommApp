package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "communications")
public class Communication implements Serializable {
    //-------------------------------attributes------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer communicationId;
    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 255)
    private String filePath;

    private Boolean isRead;
    private LocalDateTime createdAt;
//----------------------------Relationships-------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "reply_to_id")
    private Communication replyTo;

    @OneToMany(mappedBy = "replyTo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Communication> replies;

    @OneToMany(mappedBy = "communication", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FileAttachment> attachments;

    public Communication() {}

    // Getters and Setters
    public Integer getCommunicationId() { return communicationId; }
    public void setCommunicationId(Integer communicationId) { this.communicationId = communicationId; }
    public Consultation getConsultation() { return consultation; }
    public void setConsultation(Consultation consultation) { this.consultation = consultation; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    public MessageType getMessageType() { return messageType; }
    public void setMessageType(MessageType messageType) { this.messageType = messageType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public Communication getReplyTo() { return replyTo; }
    public void setReplyTo(Communication replyTo) { this.replyTo = replyTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<Communication> getReplies() { return replies; }
    public void setReplies(List<Communication> replies) { this.replies = replies; }
    public List<FileAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<FileAttachment> attachments) { this.attachments = attachments; }
}
