// controllers/PdfController.java
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
// @CrossOrigin(origins = "*") // Uncomment if CORS issues
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
            byte[] pdfData = medicalFormService.getPdfData(formId);
            MedicalForm form = medicalFormService.getAllMedicalForms().stream()
                    .filter(f -> f.getFormId().equals(formId))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Form not found"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", form.getPdfFileName());
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all forms with PDF information for admin dashboard
     */
    @GetMapping("/admin/forms")
    public ResponseEntity<List<Map<String, Object>>> getAllFormsForAdmin() {
        try {
            List<MedicalForm> forms = medicalFormService.getAllMedicalFormsWithPdf();
            
            List<Map<String, Object>> formData = forms.stream().map(form -> {
                Map<String, Object> data = new HashMap<>();
                data.put("formId", form.getFormId());
                
                // Use the exact method names from Patient entity
                String patientName = form.getPatient().getName() != null ? 
                    form.getPatient().getName() : "Patient sans nom";
                
                data.put("patientName", patientName);
                data.put("doctorName", form.getDoctor().getName());
                data.put("createdAt", form.getCreatedAt());
                data.put("status", form.getStatus());
                data.put("pdfGenerated", form.getPdfGenerated());
                data.put("pdfFileName", form.getPdfFileName());
                data.put("pdfGeneratedAt", form.getPdfGeneratedAt());
                data.put("downloadUrl", "/api/pdf/download/" + form.getFormId());
                return data;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(formData);
            
        } catch (Exception e) {
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
            MedicalForm form = medicalFormService.getAllMedicalForms().stream()
                    .filter(f -> f.getFormId().equals(formId))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Form not found"));

            medicalFormService.generateAndSavePdf(form);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "PDF regenerated successfully");
            response.put("formId", formId);
            response.put("pdfFileName", form.getPdfFileName());

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error regenerating PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}