package com.na.medical_mobile_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // REMOVE THE EMPTY addCorsMappings METHOD COMPLETELY
    // Your CorsConfig.java will handle CORS
}