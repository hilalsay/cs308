package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.repo.UserRepo;
import edu.sabanciuniv.cs308.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    private JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserService(UserRepo userRepo, JwtService jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    public String registerUser(User user) {
        // Check if the username already exists
        Optional<User> existingUser = userRepo.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return "Username is already taken!";
        }

        // Check if the email already exists
        Optional<User> existingEmail = userRepo.findByEmail(user.getEmail());
        if (existingEmail.isPresent()) {
            return "Email is already registered!";
        }

        // If both username and email are unique, save the user
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully!";
    }

    public String loginUser(String username, String password) {
        // Find user by username
        Optional<User> user = userRepo.findByUsername(username);

        // If the user doesn't exist, return an error message
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found!");
        }

        // Check if the password matches
        if (encoder.matches(password, user.get().getPassword())) {
            // Generate a JWT token
            String token = jwtService.generateToken(username);

            // Return the token
            return token;
        } else {
            throw new BadCredentialsException("Invalid password!");
        }
    }


    // Method for retrieving all users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
