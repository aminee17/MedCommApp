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
//---------------------------------Get logged in user -------------------------------------------------------------
public User getLoggedInUser() {
    System.out.println("UserService.getLoggedInUser called");
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    
    if (auth == null || auth.getName().equals("anonymousUser")) {
        System.out.println("No authentication found, checking for userId parameter");
        // Check for user ID in request header or parameter
        // This is a simplified approach - in production you'd use proper JWT or session-based auth
        String userId = getRequestParameter("userId");
        System.out.println("userId parameter: " + userId);
        
        if (userId != null && !userId.isEmpty()) {
            try {
                Integer id = Integer.parseInt(userId);
                System.out.println("Looking up user by ID: " + id);
                User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
                System.out.println("Found user: " + user.getName() + " (" + user.getRole() + ")");
                return user;
            } catch (NumberFormatException e) {
                System.err.println("Invalid user ID format: " + userId);
                throw new RuntimeException("Invalid user ID format");
            }
        }
        
        System.err.println("No userId parameter found");
        throw new RuntimeException("No authentication found");
    }
    
    // Try to find by email first
    String email = auth.getName();
    System.out.println("Authentication found, looking up user by email: " + email);
    User user = userRepository.findByEmail(email);
    
    if (user == null) {
        // If not found by email, try by ID
        try {
            Integer id = Integer.parseInt(email);
            System.out.println("Email looks like an ID, looking up user by ID: " + id);
            user = userRepository.findById(id).orElse(null);
        } catch (NumberFormatException ignored) {
            // Not a numeric ID, continue
            System.out.println("Not a numeric ID: " + email);
        }
    }
    
    if (user == null) {
        System.err.println("User not found: " + email);
        throw new RuntimeException("User not found: " + email);
    }
    
    System.out.println("Found user: " + user.getName() + " (" + user.getRole() + ")");
    return user;
}

// Helper method to get request parameters
private String getRequestParameter(String paramName) {
    try {
        System.out.println("Getting request parameter: " + paramName);
        // Get the current request from the servlet context
        jakarta.servlet.http.HttpServletRequest request = 
            ((org.springframework.web.context.request.ServletRequestAttributes)
            org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
            .getRequest();
            
        // Try header first
        String headerValue = request.getHeader(paramName);
        System.out.println("Header value for " + paramName + ": " + headerValue);
        
        // Then try parameter
        String paramValue = request.getParameter(paramName);
        System.out.println("Parameter value for " + paramName + ": " + paramValue);
        
        // Use header if available, otherwise use parameter
        String value = headerValue;
        if (value == null || value.isEmpty()) {
            value = paramValue;
        }
        
        System.out.println("Final value for " + paramName + ": " + value);
        return value;
    } catch (Exception e) {
        System.err.println("Error getting request parameter: " + e.getMessage());
        e.printStackTrace();
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
