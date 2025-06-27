package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

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
}