package com.na.medical_mobile_app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    //--------------------------Attributes--------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    private String action;
    private String resourceType;
    private Integer resourceId;

    @Column(columnDefinition = "JSON")
    private String oldValues;

    @Column(columnDefinition = "JSON")
    private String newValues;

    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;

    //-------------------------------Relationships--------------------------------
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;













    // Getters and setters
}