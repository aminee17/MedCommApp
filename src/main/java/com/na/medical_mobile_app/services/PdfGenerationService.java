// service/PdfGenerationService.java
package com.na.medical_mobile_app.services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;
import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.entities.Patient;
import com.na.medical_mobile_app.entities.User;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    public byte[] generateMedicalFormPdf(MedicalForm form) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            
            PDPage page = new PDPage();
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Set up fonts
                PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font normalFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
                
                float margin = 50;
                float yPosition = 750;
                float lineHeight = 14;
                float sectionSpacing = 20;
                
                // Title
                contentStream.setFont(titleFont, 16);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("FORMULAIRE MÉDICAL - ÉPILEPSIE");
                contentStream.endText();
                yPosition -= 30;
                
                // Form ID and Date
                contentStream.setFont(normalFont, 10);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Formulaire #: " + form.getFormId() + " | Généré le: " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")));
                contentStream.endText();
                yPosition -= 20;
                
                // Patient Information Section
                yPosition = addSectionTitle(contentStream, "INFORMATIONS PATIENT", margin, yPosition, boldFont);
                yPosition = addPatientInfo(contentStream, form.getPatient(), margin, yPosition, boldFont, normalFont);
                
                // Medical Form Details Section
                yPosition -= sectionSpacing;
                yPosition = addSectionTitle(contentStream, "DÉTAILS DU FORMULAIRE MÉDICAL", margin, yPosition, boldFont);
                yPosition = addFormDetails(contentStream, form, margin, yPosition, boldFont, normalFont);
                
                // Symptoms Section
                if (form.getSymptoms() != null && !form.getSymptoms().isEmpty()) {
                    yPosition -= sectionSpacing;
                    yPosition = addSectionTitle(contentStream, "SYMPTÔMES ET DESCRIPTION DES CRISES", margin, yPosition, boldFont);
                    yPosition = addWrappedText(contentStream, form.getSymptoms(), margin, yPosition, normalFont, 12);
                }
                
                // Doctor Information
                yPosition -= sectionSpacing;
                yPosition = addSectionTitle(contentStream, "INFORMATIONS DU MÉDECIN RÉFÉRENT", margin, yPosition, boldFont);
                yPosition = addDoctorInfo(contentStream, form.getDoctor(), margin, yPosition, boldFont, normalFont);
                
                // Footer
                contentStream.setFont(normalFont, 8);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, 30);
                contentStream.showText("Document généré automatiquement par le système Medical Mobile App");
                contentStream.endText();
            }
            
            document.save(baos);
            return baos.toByteArray();
        }
    }
    
    private float addSectionTitle(PDPageContentStream contentStream, String title, float margin, float yPosition, PDType1Font font) throws IOException {
        contentStream.setFont(font, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(margin, yPosition);
        contentStream.showText(title);
        contentStream.endText();
        return yPosition - 15;
    }
    
    private float addPatientInfo(PDPageContentStream contentStream, Patient patient, float margin, float yPosition, PDType1Font boldFont, PDType1Font normalFont) throws IOException {
        float currentY = yPosition;
        
        // Use the exact method names from your Patient entity
        String name = patient.getName() != null ? patient.getName() : "Non spécifié";
        String birthdate = patient.getBirthdate() != null ? 
            patient.getBirthdate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "Non spécifié";
        String gender = patient.getGender() != null ? patient.getGender().toString() : "Non spécifié";
        String cin = patient.getCin() != null ? patient.getCin().toString() : "Non spécifié";
        String phone = patient.getPhone() != null ? patient.getPhone() : "Non spécifié";
        String address = patient.getAddress() != null ? patient.getAddress() : "Non spécifié";
        
        currentY = addKeyValueLine(contentStream, "Nom complet:", name, margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Date de naissance:", birthdate, margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Sexe:", gender, margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "CIN:", cin, margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Téléphone:", phone, margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Adresse:", address, margin, currentY, boldFont, normalFont);
        
        return currentY;
    }
    
    private float addFormDetails(PDPageContentStream contentStream, MedicalForm form, float margin, float yPosition, PDType1Font boldFont, PDType1Font normalFont) throws IOException {
        float currentY = yPosition;
        
        currentY = addKeyValueLine(contentStream, "Date première crise:", 
            formatDate(form.getDateFirstSeizure()), margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Date dernière crise:", 
            formatDate(form.getDateLastSeizure()), margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Nombre total de crises:", 
            form.getTotalSeizures() != null ? form.getTotalSeizures().toString() : "Non spécifié", 
            margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Durée moyenne (min):", 
            form.getAverageSeizureDuration() != null ? form.getAverageSeizureDuration().toString() : "Non spécifié", 
            margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Fréquence des crises:", 
            form.getSeizureFrequency() != null ? form.getSeizureFrequency().toString() : "Non spécifié", 
            margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Statut:", 
            form.getStatus() != null ? form.getStatus().toString() : "Non spécifié", 
            margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Date de création:", 
            form.getCreatedAt() != null ? 
            form.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "Non spécifié", 
            margin, currentY, boldFont, normalFont);
        
        return currentY;
    }
    
    private float addDoctorInfo(PDPageContentStream contentStream, User doctor, float margin, float yPosition, PDType1Font boldFont, PDType1Font normalFont) throws IOException {
        float currentY = yPosition;
        
        currentY = addKeyValueLine(contentStream, "Nom:", doctor.getName(), margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Email:", doctor.getEmail(), margin, currentY, boldFont, normalFont);
        currentY = addKeyValueLine(contentStream, "Spécialité:", doctor.getSpecialization(), margin, currentY, boldFont, normalFont);
        
        return currentY;
    }
    
    private float addKeyValueLine(PDPageContentStream contentStream, String key, String value, float margin, float yPosition, PDType1Font boldFont, PDType1Font normalFont) throws IOException {
        if (value != null && !value.trim().isEmpty()) {
            // Key
            contentStream.setFont(boldFont, 10);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText(key + " ");
            contentStream.endText();
            
            // Value
            contentStream.setFont(normalFont, 10);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin + getStringWidth(key + " ", boldFont, 10), yPosition);
            contentStream.showText(value);
            contentStream.endText();
            
            return yPosition - 12;
        }
        return yPosition;
    }
    
    private float getStringWidth(String text, PDType1Font font, float fontSize) throws IOException {
        return font.getStringWidth(text) / 1000 * fontSize;
    }
    
    private float addWrappedText(PDPageContentStream contentStream, String text, float margin, float yPosition, PDType1Font font, float fontSize) throws IOException {
        contentStream.setFont(font, fontSize);
        
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        float lineWidth = 0;
        float maxWidth = 500;
        
        for (String word : words) {
            float wordWidth = getStringWidth(line + word + " ", font, fontSize);
            
            if (lineWidth + wordWidth < maxWidth) {
                line.append(word).append(" ");
                lineWidth += wordWidth;
            } else {
                // Draw the current line
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText(line.toString());
                contentStream.endText();
                
                // Start new line
                line = new StringBuilder(word + " ");
                lineWidth = wordWidth;
                yPosition -= 15;
                
                // Check if we need a new page (simplified)
                if (yPosition < 50) {
                    // In a real implementation, you'd create a new page here
                    break;
                }
            }
        }
        
        // Draw the last line
        if (line.length() > 0) {
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText(line.toString());
            contentStream.endText();
            yPosition -= 15;
        }
        
        return yPosition;
    }
    
    private String formatDate(LocalDate date) {
        if (date == null) return "Non spécifié";
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    public String generatePdfFileName(MedicalForm form) {
        String patientName = form.getPatient().getName() != null ? 
            form.getPatient().getName().replaceAll("[^a-zA-Z0-9]", "_") : "Patient";
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return "Formulaire_Medical_" + patientName + "_" + form.getFormId() + "_" + timestamp + ".pdf";
    }
}