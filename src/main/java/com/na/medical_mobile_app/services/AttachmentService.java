package com.na.medical_mobile_app.services;
import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.FileAttachment;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.FileAttachmentRepository;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.security.CryptoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.CipherOutputStream;
import javax.crypto.SecretKey;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentService {

    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;
    @Autowired
    private MedicalFormRepository medicalFormRepository;



  //----------------------------------Attachement by ID-------------------------------------------------------------------------
  public FileAttachment getAttachmentById(Integer attachmentId) {
      return fileAttachmentRepository.findById(attachmentId)
              .orElseThrow(() -> new IllegalArgumentException("Attachment not found with id: " + attachmentId));
  }

    //-------------------------------Extracting the actual attachement to controller-----------------------------------------------
 public byte[] getDecryptedAttachmentBytes(Integer attachmentId) throws Exception {
     FileAttachment attachment = fileAttachmentRepository.findById(attachmentId)
             .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));

     Path path = Paths.get("encrypted-uploads").resolve(attachment.getFilePath());
     byte[] encryptedBytes = Files.readAllBytes(path);

     SecretKey key = CryptoUtils.loadSecretKey();
     Cipher cipher = Cipher.getInstance("AES");
     cipher.init(Cipher.DECRYPT_MODE, key);

     return cipher.doFinal(encryptedBytes);
 }


//---------------------------------Saving an encrypted attachement--------------------------------------------------------------

    public void encryptAndSaveFile(InputStream fileInputStream, String encryptedFileName) throws Exception {
        SecretKey secretKey = CryptoUtils.loadSecretKey();

        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        Path outputPath = Paths.get("encrypted-uploads", encryptedFileName);
        Files.createDirectories(outputPath.getParent());

        try (FileOutputStream fos = new FileOutputStream(outputPath.toFile());
             CipherOutputStream cos = new CipherOutputStream(fos, cipher)) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                cos.write(buffer, 0, bytesRead);
            }
        }
    }
//---------------------------------Saving attachments : First submission M->N------------------------------------------------
    public List<FileAttachment> saveAttachments(  MedicalForm medicalForm,
                                                  MultipartFile mriPhoto,
                                                  MultipartFile seizureVideo,
                                                  User uploadedBy) throws Exception{
        List<FileAttachment> attachments = new ArrayList<>();
        try {

                if (mriPhoto != null && !mriPhoto.isEmpty()) {
                    String encryptedFileName = "mri_photo_" + System.currentTimeMillis() + ".enc";
                    encryptAndSaveFile(mriPhoto.getInputStream(), encryptedFileName);

                    FileAttachment mriAttachment = createAttachment(
                            medicalForm,
                            mriPhoto.getOriginalFilename(),
                            encryptedFileName,
                            mriPhoto.getContentType(),
                            mriPhoto.getSize(),
                            uploadedBy
                    );
                    attachments.add(fileAttachmentRepository.save(mriAttachment));
                }

                if (seizureVideo != null && !seizureVideo.isEmpty()) {
                    String encryptedFileName = "seizure_video_" + System.currentTimeMillis() + ".enc";
                    encryptAndSaveFile(seizureVideo.getInputStream(), encryptedFileName);

                    FileAttachment videoAttachment = createAttachment(
                            medicalForm,
                            seizureVideo.getOriginalFilename(),
                            encryptedFileName,
                            seizureVideo.getContentType(),
                            seizureVideo.getSize(),
                            uploadedBy
                    );
                    attachments.add(fileAttachmentRepository.save(videoAttachment));
                }

        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return attachments;
    }

 //---------------------------------Creating an attachement in the right form : 1st M->N-------------------------------------
    private FileAttachment createAttachment(MedicalForm medicalForm, String fileName, String filePath, String mimeType, Long fileSize, User uploadedBy) {
        FileAttachment attachment = new FileAttachment();
        attachment.setForm(medicalForm);
        attachment.setFileName(fileName);
        attachment.setFilePath(filePath);
        attachment.setMimeType(mimeType);
        attachment.setIsEncrypted(true);
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setUploadedBy(uploadedBy);

        if (fileSize != null) {
            try {
                attachment.setFileSize(fileSize);
            } catch (Exception e) {
                attachment.setFileSize(0L);
            }
        } else {
            attachment.setFileSize(0L);
        }

        return attachment;
    }
 //------------------------------------Getting the right attachment Form : N->M--------------------------------------------
         public List<String> extractFilePaths(List<FileAttachment> attachments) {
             return attachments.stream()
                     .map(FileAttachment::getFilePath)
                     .collect(Collectors.toList());
         }

    public List<FileAttachment> getAttachmentsByFormId(Integer formId) {
        Optional<MedicalForm> medicalFormOpt = medicalFormRepository.findById(formId);
        if (medicalFormOpt.isEmpty()) {
            // handle form not found, maybe return empty list or throw exception
            return Collections.emptyList();
        }
        MedicalForm medicalForm = medicalFormOpt.get();
        List<FileAttachment> attachments = fileAttachmentRepository.findByForm(medicalForm);

        // Return simplified list if you want DTO-like objects:
        return attachments.stream()
                .map(att -> new FileAttachment(att.getAttachmentId(), att.getFileName(), att.getMimeType()))
                .collect(Collectors.toList());
    }

}
