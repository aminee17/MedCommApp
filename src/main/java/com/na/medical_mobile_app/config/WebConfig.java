package com.na.medical_mobile_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                    "https://medcommapp-frontend.onrender.com",
                    "https://medcommapp.onrender.com",
                    "http://localhost:3000", 
                    "http://localhost:19006",
                    "http://localhost:8081",
                    "exp://*",
                    "http://192.168.*.*:19006"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "userid", "userId", "User-ID", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers")
                .exposedHeaders("Authorization", "Content-Type", "userid", "UserId")
                .allowCredentials(true)
                .maxAge(3600);
        
        // Additional mapping for websockets if needed
        registry.addMapping("/ws/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowCredentials(true);
    }
}