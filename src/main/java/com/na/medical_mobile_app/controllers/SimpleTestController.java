package com.na.medical_mobile_app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
public class SimpleTestController {
    
    @GetMapping("/test")
    public String test() {
        return "API IS WORKING! Time: " + new java.util.Date();
    }
    
    @GetMapping("/patients")
    public List<String> getPatients() {
        return Arrays.asList("Patient 1", "Patient 2", "Patient 3");
    }
    
    @GetMapping("/")
    public String home() {
        return "Medical App is running! Database and Security are temporarily disabled.";
    }
}