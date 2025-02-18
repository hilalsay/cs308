package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "user")
public class User {
    @Column
    private LocalDateTime createdAt;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String homeAddress;

    @Column(nullable = false)
    private String taxId;

    @Column(nullable = false)
    private String role;

    public User() {
        this.name = "No name";
    }

    // Constructor
    public User(String name, String email, String password, String role ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.role = role;
    }

    public User(String mail) {
    }

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.role = "User";
    }
}
