package edu.sabanciuniv.cs308.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;

    // Constructors, getters, and setters
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
