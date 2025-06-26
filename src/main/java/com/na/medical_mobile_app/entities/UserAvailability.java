package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_availability")
public class UserAvailability implements Serializable {
    //---------------------------Attrubutes---------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer availabilityId;

    private Boolean isAvailable;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    private LocalDateTime lastSeen;

    //---------------------------Relationships---------------------------
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //---------------------------Constructor & getters & setters---------------------------
    public UserAvailability(User user, Boolean isAvailable, UserStatus status, LocalDateTime lastSeen) {
        this.user = user;
        this.isAvailable = isAvailable;
        this.status = status;
        this.lastSeen = lastSeen;
    }
    public UserAvailability() {}

    public Integer getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Integer availabilityId) { this.availabilityId = availabilityId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
}
