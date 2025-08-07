package com.na.medical_mobile_app.entities;


import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_attachments")
public class FileAttachment implements Serializable {

 //---------------------------Attributes---------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attachmentId;

    @Column(length = 255)
    private String fileName;

    @Column(length = 500)
    private String filePath;

    private Long fileSize;

    @Column(length = 100)
    private String mimeType;

    private Boolean isEncrypted;
    private LocalDateTime uploadedAt;
    //---------------------------Relationships---------------------------
    @ManyToOne
    @JoinColumn(name = "communication_id")
    private Communication communication;

    @ManyToOne
    @JoinColumn(name = "form_id")
    private MedicalForm form;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    public FileAttachment() {}

   public FileAttachment(Integer attachmentId, String fileName, String mimeType) {
       this.attachmentId = attachmentId;
       this.fileName = fileName;
       this.mimeType = mimeType;
   }

   public Integer getAttachmentId() { return attachmentId; }
    public void setAttachmentId(Integer attachmentId) { this.attachmentId = attachmentId; }
    public Communication getCommunication() { return communication; }
    public void setCommunication(Communication communication) { this.communication = communication; }
    public MedicalForm getForm() { return form; }
    public void setForm(MedicalForm form) { this.form = form; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public Boolean getIsEncrypted() { return isEncrypted; }
    public void setIsEncrypted(Boolean isEncrypted) { this.isEncrypted = isEncrypted; }
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
