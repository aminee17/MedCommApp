// service/PdfStorageService.java
package com.na.medical_mobile_app.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.na.medical_mobile_app.entities.MedicalForm;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PdfStorageService {

    @Value("${pdf.storage.directory:./pdf-storage}")
    private String storageDirectory;

    public String savePdfToFileSystem(byte[] pdfData, String fileName) throws IOException {
        // Create storage directory if it doesn't exist
        Path storagePath = Paths.get(storageDirectory);
        if (!Files.exists(storagePath)) {
            Files.createDirectories(storagePath);
        }

        // Save PDF file
        Path filePath = storagePath.resolve(fileName);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(pdfData);
        }

        return filePath.toString();
    }

    public byte[] loadPdfFromFileSystem(String filePath) throws IOException {
        return Files.readAllBytes(Paths.get(filePath));
    }

    public boolean deletePdfFile(String filePath) {
        try {
            return Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            return false;
        }
    }

    public String getPdfDownloadUrl(Integer formId) {
        return "/api/pdf/download/" + formId;
    }
}