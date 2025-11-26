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


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //---------------------------------Get logged in user - JWT secured -------------------------------------------------------------
    public User getLoggedInUser() {
        int maxRetries = 3;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                System.out.println("🔄 UserService.getLoggedInUser attempt " + attempt);
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();

                if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                    if (attempt < maxRetries) {
                        System.out.println("⏳ No authentication found, waiting before retry...");
                        Thread.sleep(1000L * attempt);
                        continue;
                    }

                    System.err.println("❌ No authentication found after " + maxRetries + " attempts");
                    throw new RuntimeException("No authentication found");
                }

                String principal = auth.getName();
                System.out.println("🔍 Authentication found, looking up user by principal: " + principal);

                User user = userRepository.findByEmail(principal);
                if (user == null) {
                    try {
                        Integer id = Integer.parseInt(principal);
                        user = userRepository.findById(id).orElse(null);
                    } catch (NumberFormatException ignored) {
                        // principal is not an ID, ignore
                    }
                }

                if (user != null) {
                    System.out.println("✅ Found authenticated user: " + user.getName() + " (" + user.getRole() + ")");
                    return user;
                }

                if (attempt < maxRetries) {
                    System.out.println("⏳ Authenticated principal not found in DB, retrying...");
                    Thread.sleep(1000L * attempt);
                    continue;
                }

                System.err.println("❌ User not found for principal: " + principal);
                throw new RuntimeException("User not found: " + principal);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Authentication interrupted");
            } catch (Exception e) {
                System.err.println("❌ Error in getLoggedInUser attempt " + attempt + ": " + e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000L * attempt);
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

    //---------------------------------Get user by ID -------------------------------------------------------------
    public User getUserById(Integer userId) {
        System.out.println("🔍 Looking up user by ID: " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        System.out.println("✅ Found user: " + user.getName() + " (" + user.getRole() + ")");
        return user;
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
