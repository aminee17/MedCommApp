package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    User findByCin(Long cin);
    User findByPhone(String phone);
    List<User> findByRole(Role role);
    List<User> findByIsActive(Boolean isActive);
    List<User> findBySpecialization(String specialization);
    List<User> findByHospitalAffiliation(String hospitalAffiliation);
    List<User> findByLicenseNumber(String licenseNumber);
    List<User> findByGovernorate(Governorate governorate);
    List<User> findByCity(City city);
    List<User> findByNameContainingIgnoreCase(String namePattern);
    List<User> findByEmailContainingIgnoreCase(String emailPattern);
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByRoleAndIsActive(Role role, Boolean isActive);
    List<User> findByRoleAndSpecialization(Role role, String specialization);
    List<User> findByGovernorateAndCity(Governorate governorate, City city);
    
    @Query("SELECT u FROM User u WHERE u.isActive = false AND u.role IN (:roles)")
    List<User> findPendingRequestsByRoles(@Param("roles") List<Role> roles);
    
    Optional<User> findFirstByRoleIn(List<Role> roles);
    
    // New method to find active neurologists
    List<User> findByRoleInAndIsActiveTrue(List<Role> roles);
}