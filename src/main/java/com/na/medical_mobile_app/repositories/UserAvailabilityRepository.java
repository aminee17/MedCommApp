package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.UserAvailability;
import com.na.medical_mobile_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, Integer> {
    UserAvailability findByUser(User user);
}