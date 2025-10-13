package com.na.medical_mobile_app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class CorsConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    
    @Value("${cors.allowed-origins:https://quiet-douhua-cb85eb.netlify.app}")
    private String allowedOrigins;
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = allowedOrigins.split(",");
                
                logger.info("=== CORS CONFIGURATION ===");
                logger.info("Allowed Origins: {}", java.util.Arrays.toString(origins));
                logger.info("=== END CORS CONFIG ===");
                
                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}