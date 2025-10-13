package com.na.medical_mobile_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class CorsConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                logger.info("=== UPDATED CORS CONFIGURATION ===");
                
                registry.addMapping("/**")
                        .allowedOrigins(
                            "https://medcommapp-frontend.onrender.com", // YOUR EXACT FRONTEND URL
                            "https://medcommapp.onrender.com",
                            "http://localhost:3000",
                            "http://localhost:19006",
                            "http://localhost:8080"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                
                logger.info("CORS configured with frontend: https://medcommapp-frontend.onrender.com");
                logger.info("=== END CORS CONFIG ===");
            }
        };
    }
}