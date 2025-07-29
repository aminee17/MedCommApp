package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormRequest;
import com.na.medical_mobile_app.entities.*;
import com.na.medical_mobile_app.repositories.MedicalFormRepository;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for intelligently assigning neurologists to medical forms
 */
@Service
public class NeurologistAssignmentService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MedicalFormRepository medicalFormRepository;

    /**
     * Assigns the most appropriate neurologist to a medical form based on multiple factors:
     * 1. Workload balancing - assigns to neurologists with fewer active cases
     * 2. Continuity of care - prefers the same neurologist for returning patients
     * 3. Specialization matching - considers neurologist specializations (if available)
     * 
     * @param patient The patient for whom the form is being submitted
     * @param request The medical form request containing symptoms and details
     * @return The selected neurologist
     */
    public User assignNeurologistToForm(Patient patient, MedicalFormRequest request) {
        // Step 1: Check if patient has previous forms with a neurologist
        User previousNeurologist = findPreviousNeurologistForPatient(patient);
        if (previousNeurologist != null) {
            // Return the same neurologist for continuity of care
            return previousNeurologist;
        }
        
        // Step 2: Get all active neurologists
        List<User> neurologists = userRepository.findByRoleInAndIsActiveTrue(
                List.of(Role.NEUROLOGUE, Role.NEUROLOGUE_RESIDENT));
        
        if (neurologists.isEmpty()) {
            throw new RuntimeException("Aucun neurologue actif trouvé dans le système");
        }
        
        // Step 3: Calculate workload for each neurologist
        Map<User, Integer> workloadMap = calculateWorkload(neurologists);
        
        // Step 4: Find neurologists with specialization matching the case (if any)
        List<User> specializedNeurologists = findSpecializedNeurologists(neurologists, request);
        
        // Step 5: Select the neurologist with the lowest workload
        // Prioritize specialized neurologists if available
        List<User> candidateNeurologists = !specializedNeurologists.isEmpty() ? 
                specializedNeurologists : neurologists;
        
        return candidateNeurologists.stream()
                .min(Comparator.comparing(workloadMap::get))
                .orElse(neurologists.get(0)); // Fallback to first neurologist if comparison fails
    }
    
    /**
     * Find a previous neurologist who has handled this patient's cases
     */
    private User findPreviousNeurologistForPatient(Patient patient) {
        List<MedicalForm> previousForms = medicalFormRepository.findByPatientOrderByCreatedAtDesc(patient);
        if (!previousForms.isEmpty()) {
            // Get the most recent form's assigned neurologist
            return previousForms.get(0).getAssignedTo();
        }
        return null;
    }
    
    /**
     * Calculate the current workload (number of active cases) for each neurologist
     */
    private Map<User, Integer> calculateWorkload(List<User> neurologists) {
        Map<User, Integer> workloadMap = new HashMap<>();
        
        // Initialize all neurologists with zero workload
        neurologists.forEach(n -> workloadMap.put(n, 0));
        
        // Count active cases for each neurologist
        neurologists.forEach(neurologist -> {
            int activeFormCount = medicalFormRepository.findByAssignedToAndStatus(
                    neurologist, FormStatus.SUBMITTED).size();
            workloadMap.put(neurologist, activeFormCount);
        });
        
        return workloadMap;
    }
    
    /**
     * Find neurologists with specializations relevant to the case
     * This is a sophisticated implementation that extracts symptoms from the request
     * and matches them with neurologist specializations
     */
    private List<User> findSpecializedNeurologists(List<User> neurologists, MedicalFormRequest request) {
        // Extract all symptoms and keywords from the request
        Set<String> keywords = extractKeywords(request);
        
        if (keywords.isEmpty()) {
            return Collections.emptyList();
        }

        // Match neurologists with relevant specializations
        return neurologists.stream()
                .filter(n -> {
                    String specialization = n.getSpecialization();
                    if (specialization == null || specialization.isBlank()) {
                        return false;
                    }

                    // Check if any keyword matches the specialization
                    String specLower = specialization.toLowerCase();
                    for (String keyword : keywords) {
                        if (specLower.contains(keyword)) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Extract relevant keywords from the medical form request
     */
    private Set<String> extractKeywords(MedicalFormRequest request) {
        Set<String> keywords = new HashSet<>();
        
        // Add seizure type (single choice)
        if (request.getSeizureType() != null && !request.getSeizureType().isBlank()) {
            String seizureType = request.getSeizureType().toLowerCase();
            keywords.add(seizureType);
            
            // Add common medical terms for this type
            if (seizureType.contains("absence")) {
                keywords.add("petit mal");
                keywords.add("absence");
            } else if (seizureType.contains("tonic") || seizureType.contains("clonic")) {
                keywords.add("grand mal");
                keywords.add("convulsive");
            } else if (seizureType.contains("focal")) {
                keywords.add("partial");
                keywords.add("focal");
            }
        }
        
        // Add symptoms
        if (Boolean.TRUE.equals(request.getLossOfConsciousness())) {
            keywords.add("conscience");
            keywords.add("unconscious");
        }
        
        if (Boolean.TRUE.equals(request.getBodyStiffening())) {
            keywords.add("tonic");
            keywords.add("stiffening");
            keywords.add("rigidity");
        }
        
        if (Boolean.TRUE.equals(request.getClonicJerks())) {
            keywords.add("clonic");
            keywords.add("jerking");
            keywords.add("convulsion");
        }
        
        if (Boolean.TRUE.equals(request.getEyeDeviation())) {
            keywords.add("ocular");
            keywords.add("eye");
            keywords.add("vision");
        }
        
        // Add aura information
        if (Boolean.TRUE.equals(request.getHasAura()) && 
            request.getAuraDescription() != null && 
            !request.getAuraDescription().isBlank()) {
            
            keywords.add("aura");
            
            // Add words from aura description
            Arrays.stream(request.getAuraDescription().toLowerCase().split("\\s+"))
                  .filter(word -> word.length() > 3) // Skip short words
                  .forEach(keywords::add);
        }
        
        // Add other information
        if (request.getOtherInformation() != null && !request.getOtherInformation().isBlank()) {
            Arrays.stream(request.getOtherInformation().toLowerCase().split("\\s+"))
                  .filter(word -> word.length() > 3) // Skip short words
                  .forEach(keywords::add);
        }
        
        // Add frequency-related keywords
        if (request.getSeizureFrequency() != null) {
            keywords.add(request.getSeizureFrequency().name().toLowerCase());
            
            switch (request.getSeizureFrequency()) {
                case DAILY:
                    keywords.add("frequent");
                    keywords.add("severe");
                    break;
                case WEEKLY:
                    keywords.add("regular");
                    keywords.add("moderate");
                    break;
                case MONTHLY:
                case YEARLY:
                    keywords.add("occasional");
                    keywords.add("rare");
                    break;
            }
        }
        
        return keywords;
    }
}