package com.na.medical_mobile_app.DTOs;

import com.na.medical_mobile_app.entities.Role;

public class LoginResponse {
    private String message;
    private Integer userId;
    private String name;
    private String email;
    private Role role;

    // Default constructor
    public LoginResponse() {
    }

    // Constructor with all fields
    public LoginResponse(String message, Integer userId, String name, String email, Role role) {
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}