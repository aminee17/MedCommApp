package com.na.medical_mobile_app.DTOs;

public class JwtResponse {
    private final String jwttoken;
    private Integer userId;
    private String name;
    private String email;
    private String role;

    public JwtResponse(String jwttoken) {
        this.jwttoken = jwttoken;
    }

    public JwtResponse(String jwttoken, Integer userId, String name, String email, String role) {
        this.jwttoken = jwttoken;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return this.jwttoken;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}