package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.dto.User;
import edu.sabanciuniv.cs308.dto.LoginRequest;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private List<User> users = new ArrayList<>();

    public String registerUser(User user) {
        for (User existingUser : users) {
            if (existingUser.getUsername().equals(user.getUsername())) {
                return "User already exists!";
            }
        }
        users.add(user);
        return "User registered successfully!";
    }

    public String loginUser(LoginRequest loginRequest) {
        for (User user : users) {
            if (user.getUsername().equals(loginRequest.getUsername())
                    && user.getPassword().equals(loginRequest.getPassword())) {
                return "Login successful!";
            }
        }
        return "Invalid username or password.";
    }
}
