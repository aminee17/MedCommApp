package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Integer> {
    List<FileAttachment> findByCommunication(Communication communication);
    List<FileAttachment> findByForm(MedicalForm form);
    List<FileAttachment> findByUploadedBy(User uploadedBy);
    List<FileAttachment> findByMimeType(String mimeType);
    List<FileAttachment> findByIsEncrypted(Boolean isEncrypted);
    List<FileAttachment> findByUploadedAtBetween(LocalDateTime start, LocalDateTime end);
    List<FileAttachment> findByFileNameContainingIgnoreCase(String fileName);
    List<FileAttachment> findByFileSizeGreaterThan(Long size);
    List<FileAttachment> findByUploadedByAndUploadedAtBetween(User uploadedBy, LocalDateTime start, LocalDateTime end);
}