package com.na.medical_mobile_app.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(SimpleCorsFilter.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        String origin = request.getHeader("Origin");
        logger.info("CORS Filter - Method: {}, Origin: {}, Path: {}", 
                    request.getMethod(), origin, request.getRequestURI());
        
        // Allow specific origins
        if (origin != null && (
                origin.equals("https://medcommapp-frontend.onrender.com") ||
                origin.equals("https://medcommapp.onrender.com") ||
                origin.startsWith("http://localhost"))) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
        
        // Handle preflight OPTIONS request
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            logger.info("OPTIONS request - returning 200 OK");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {
        logger.info("SimpleCorsFilter initialized");
    }

    @Override
    public void destroy() {
        logger.info("SimpleCorsFilter destroyed");
    }
}