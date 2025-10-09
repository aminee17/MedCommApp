package com.na.medical_mobile_app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        return "Medical App API is working! " + new java.util.Date();
    }
    
    @GetMapping("/patients")
    public List<String> getPatients() {
        return Arrays.asList("Test Patient 1", "Test Patient 2", "Test Patient 3");
    }
    
    @GetMapping("/doctors")
    public List<String> getDoctors() {
        return Arrays.asList("Doctor Smith", "Doctor Johnson");
    }
    
    @GetMapping("/health")
    public String health() {
        return "API is healthy!";
    }
}