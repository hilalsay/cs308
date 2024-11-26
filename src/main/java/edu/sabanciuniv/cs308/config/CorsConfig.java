package edu.sabanciuniv.cs308.config;

import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    public List<String> getAllowedOrigins() {
        return Arrays.asList("http://localhost:5173");  // Replace with your frontend URL
    }

    public List<String> getAllowedMethods() {
        return Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }

    public List<String> getAllowedHeaders() {
        return Arrays.asList("*");
    }

    public boolean getAllowCredentials() {
        return true;
    }
}
