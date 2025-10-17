// controller/PdfController.java - COMPLETE CORRECTED VERSION
package com.na.medical_mobile_app.controllers;

import com.na.medical_mobile_app.entities.MedicalForm;
import com.na.medical_mobile_app.services.MedicalFormService;
import com.na.medical_mobile_app.services.PdfGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdf")

public class PdfController {

    @Autowired
    private MedicalFormService medicalFormService;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    /**
     * Download PDF for a specific medical form
     */
    @GetMapping("/download/{formId}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Integer formId) {
        try {
            System.out.println("📥 Download PDF request for form ID: " + formId);
            
            byte[] pdfData = medicalFormService.getPdfData(formId);
            MedicalForm form = medicalFormService.getFormById(formId)
                    .orElseThrow(() -> new Exception("Form not found with ID: " + formId));

            String fileName = form.getPdfFileName() != null ? 
                form.getPdfFileName() : 
                "medical_form_" + formId + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            headers.setContentLength(pdfData.length);

            System.out.println("✅ PDF download successful for form ID: " + formId);
            return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error downloading PDF for form ID: " + formId + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all forms with PDF information for admin dashboard - FIXED VERSION
     */
    @GetMapping("/admin/forms")
    public ResponseEntity<List<Map<String, Object>>> getAllFormsForAdmin() {
        try {
            System.out.println("📊 Fetching all medical forms for admin dashboard...");
            
            List<MedicalForm> forms = medicalFormService.getAllMedicalFormsWithPdf();
            
            List<Map<String, Object>> formData = forms.stream().map(form -> {
                Map<String, Object> data = new HashMap<>();
                data.put("formId", form.getFormId());
                
                // Patient information - handle null safely
                String patientName = "Patient sans nom";
                if (form.getPatient() != null && form.getPatient().getName() != null) {
                    patientName = form.getPatient().getName();
                }
                data.put("patientName", patientName);
                
                // Doctor information - handle null safely
                String doctorName = "Médecin non spécifié";
                if (form.getDoctor() != null && form.getDoctor().getName() != null) {
                    doctorName = form.getDoctor().getName();
                }
                data.put("doctorName", doctorName);
                
                // Form details
                data.put("createdAt", form.getCreatedAt());
                data.put("status", form.getStatus() != null ? form.getStatus().toString() : "UNKNOWN");
                
                // PDF information - ensure we handle null values properly
                Boolean pdfGenerated = form.getPdfGenerated() != null ? form.getPdfGenerated() : false;
                data.put("pdfGenerated", pdfGenerated);
                data.put("pdfFileName", form.getPdfFileName());
                data.put("pdfGeneratedAt", form.getPdfGeneratedAt());
                data.put("downloadUrl", "/api/pdf/download/" + form.getFormId());
                
                // Debug output for each form
                System.out.println("📋 Form #" + form.getFormId() + 
                                 " - Patient: " + patientName + 
                                 " - PDF: " + pdfGenerated +
                                 " - File: " + form.getPdfFileName());
                
                return data;
            }).collect(Collectors.toList());

            System.out.println("✅ Successfully processed " + formData.size() + " forms for admin");
            return ResponseEntity.ok(formData);
            
        } catch (Exception e) {
            System.err.println("❌ Error in getAllFormsForAdmin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Regenerate PDF for a specific form
     */
    @PostMapping("/regenerate/{formId}")
    public ResponseEntity<Map<String, Object>> regeneratePdf(@PathVariable Integer formId) {
        try {
            System.out.println("🔄 Regenerating PDF for form ID: " + formId);
            
            MedicalForm form = medicalFormService.getFormById(formId)
                    .orElseThrow(() -> new Exception("Form not found with ID: " + formId));

            medicalFormService.generateAndSavePdf(form);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "PDF regenerated successfully");
            response.put("formId", formId);
            response.put("pdfFileName", form.getPdfFileName());
            response.put("pdfGenerated", form.getPdfGenerated());

            System.out.println("✅ PDF regeneration successful for form ID: " + formId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error regenerating PDF for form ID: " + formId + " - " + e.getMessage());
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error regenerating PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}