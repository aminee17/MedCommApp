package com.na.medical_mobile_app.repositories;

import com.na.medical_mobile_app.entities.User;
import com.na.medical_mobile_app.entities.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldSaveAndFindUser() {
        // Create a test user
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPhone("1234567890");
        user.setRole(Role.MEDECIN);
        user.setActive(true);

        // Save the user
        User savedUser = userRepository.save(user);

        // Find the user
        User foundUser = userRepository.findById(savedUser.getUserId()).orElse(null);

        // Verify the user was found and has correct properties
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getName()).isEqualTo("Test User");
        assertThat(foundUser.getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.getRole()).isEqualTo(Role.MEDECIN);
    }
}