package com.na.medical_mobile_app.services;

import com.na.medical_mobile_app.DTOs.MedicalFormSummaryDTO;
import com.na.medical_mobile_app.entities.Role;
import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //---------------------------------Get logged in user - IMPROVED WITH RETRY LOGIC-------------------------------------------------------------
    public User getLoggedInUser() {
        int maxRetries = 3;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                System.out.println("🔄 UserService.getLoggedInUser attempt " + attempt);
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                
                if (auth == null || auth.getName().equals("anonymousUser")) {
                    System.out.println("🔍 No authentication found, checking for userId parameter");
                    String userId = getRequestParameter("userId");
                    
                    if (userId != null && !userId.isEmpty()) {
                        try {
                            Integer id = Integer.parseInt(userId);
                            System.out.println("👤 Looking up user by ID: " + id);
                            User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
                            System.out.println("✅ Found user by ID: " + user.getName() + " (" + user.getRole() + ")");
                            return user;
                        } catch (NumberFormatException e) {
                            System.err.println("❌ Invalid user ID format: " + userId);
                            throw new RuntimeException("Invalid user ID format");
                        }
                    }
                    
                    // If we reach here and it's not the last attempt, wait and retry
                    if (attempt < maxRetries) {
                        System.out.println("⏳ Waiting before retry...");
                        Thread.sleep(1000 * attempt);
                        continue;
                    }
                    
                    System.err.println("❌ No authentication found after " + maxRetries + " attempts");
                    throw new RuntimeException("No authentication found");
                }
                
                // Try to find by email first
                String email = auth.getName();
                System.out.println("🔍 Authentication found, looking up user by email: " + email);
                User user = userRepository.findByEmail(email);
                
                if (user == null) {
                    // If not found by email, try by ID
                    try {
                        Integer id = Integer.parseInt(email);
                        System.out.println("🔍 Email looks like an ID, looking up user by ID: " + id);
                        user = userRepository.findById(id).orElse(null);
                    } catch (NumberFormatException ignored) {
                        // Not a numeric ID, continue
                    }
                }
                
                if (user != null) {
                    System.out.println("✅ Found authenticated user: " + user.getName() + " (" + user.getRole() + ")");
                    return user;
                }
                
                // If user not found and not last attempt, wait and retry
                if (attempt < maxRetries) {
                    System.out.println("⏳ User not found, waiting before retry...");
                    Thread.sleep(1000 * attempt);
                    continue;
                }
                
                System.err.println("❌ User not found: " + email);
                throw new RuntimeException("User not found: " + email);
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Authentication interrupted");
            } catch (Exception e) {
                System.err.println("❌ Error in getLoggedInUser attempt " + attempt + ": " + e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Authentication interrupted");
                    }
                } else {
                    throw new RuntimeException("Failed to get user after " + maxRetries + " attempts: " + e.getMessage());
                }
            }
        }
        
        throw new RuntimeException("Unexpected error in getLoggedInUser");
    }

    // Helper method to get request parameters - IMPROVED
    private String getRequestParameter(String paramName) {
        try {
            jakarta.servlet.http.HttpServletRequest request = 
                ((org.springframework.web.context.request.ServletRequestAttributes)
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest();
                
            // Try header first
            String headerValue = request.getHeader(paramName);
            
            // Then try parameter
            String paramValue = request.getParameter(paramName);
            
            // Use header if available, otherwise use parameter
            String value = headerValue;
            if (value == null || value.isEmpty()) {
                value = paramValue;
            }
            
            return value;
        } catch (Exception e) {
            System.err.println("⚠️ Error getting request parameter '" + paramName + "': " + e.getMessage());
            return null;
        }
    }

    //---------------------------------Get any neurologist -------------------------------------------------------------
    public User getAnyNeurologist() {
        return userRepository.findFirstByRoleIn(List.of(Role.NEUROLOGUE, Role.NEUROLOGUE_RESIDENT))
                .orElseThrow(() -> new RuntimeException("Aucun neurologue trouvé"));
    }

    //---------------------------Populating information of the referring doctor-------------------------------------------
    public void populateReferringDoctorInfo(MedicalFormSummaryDTO dto, User doctor) {
        if (doctor == null) return;

        dto.setReferringDoctorId(doctor.getUserId());
        dto.setReferringDoctorName(doctor.getName());
        dto.setReferringDoctorEmail(doctor.getEmail());
        dto.setReferringDoctorPhone(doctor.getPhone());
        dto.setReferringDoctorRole(doctor.getRole());
        dto.setReferringDoctorGovernorate(doctor.getGovernorate());
    }

}
