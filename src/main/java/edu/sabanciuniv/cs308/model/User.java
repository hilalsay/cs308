package edu.sabanciuniv.cs308.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String taxId;         // Optional
    private String homeAddress;   // Optional
    private LocalDateTime createdAt;  // Automatically set

    // Constructors, getters, and setters
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }
}
