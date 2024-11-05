package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.LoginRequest;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    // until database comes, it stores users here
    private List<User> users = new ArrayList<>();

    public String registerUser(User user) {
        for (User existingUser : users) {
            if (existingUser.getUsername().equals(user.getUsername()) && existingUser.getEmail().equals(user.getEmail())) {
                return "User already exists!";
            }
        }

        // will add password hashing

        users.add(user);
        return "User registered successfully!";
    }

    public String loginUser(LoginRequest loginRequest) {
        // will compare against hashed password
        for (User user : users) {
            if (user.getUsername().equals(loginRequest.getUsername())
                    && user.getPassword().equals(loginRequest.getPassword())) {
                return "Login successful! ID:" + user.getId();
            }
        }
        return "Invalid username or password.";
    }
    // private String hashPassword(String password) {
    //     will implement this
    // }
}
