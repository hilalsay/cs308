package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.LoginRequest;
import edu.sabanciuniv.cs308.repo.UserRepo;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.UserService;
import edu.sabanciuniv.cs308.service.SalesManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/auth")
public class UserController {
    private final UserService userService;
    @Autowired
    private SalesManagerService salesManagerService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepo userRepository;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/signup")
    public String showSignupPage() {
        return "signup";
    }
    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // New endpoint to get user information by userId
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable UUID userId) {
        try {
            User user = userService.getUserById(userId);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extract JWT token from the "Authorization" header
            String token = authorizationHeader.substring(7); // Removing "Bearer " from the token

            // Extract the user ID from the token (assuming the user ID is stored as a claim)

            String username = jwtService.extractUserName(token);
            UUID userIdFromToken = userService.getUserIdByUsername(username); // Convert username to userId

            if (userIdFromToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            // Retrieve the user information using the user ID
            User user = userService.getUserById(userIdFromToken);

            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PutMapping("/change-role")
    public ResponseEntity<String> changeUserRole(@RequestParam String username, @RequestParam String newRole) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRole(newRole);  // Update the role
            userRepository.save(user); // Save the updated user
            return ResponseEntity.ok("User role updated successfully.");
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }

    // Endpoint to get delivered products report (only for SALES_MANAGER)
    @GetMapping("/delivered-products/{userId}")
    public ResponseEntity<String> getDeliveredProductsReport(@PathVariable UUID userId, @RequestHeader("Authorization") String token) {
        // Fetch the user by userId
        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found.");
        }

        // Decode the token and get the current authenticated user's ID from the token (or any other way)
        String username = jwtService.extractUserName(token.substring(7)); // Skip "Bearer " prefix
        UUID authenticatedUserId = userService.getUserIdByUsername(username);

        // Check if the authenticated user is a SALES_MANAGER
        if (user.getRole().equals("SALES_MANAGER")) {
            // Ensure the authenticated user is the one requesting the report (Sales Manager can view other users' reports)
            if (authenticatedUserId.equals(userId)) {
                // Generate the report for delivered products for this sales manager
                String report = salesManagerService.generateDeliveredProductsReport(userId);

                if (report.equals("No delivered orders found.")) {
                    return ResponseEntity.status(404).body(report);  // 404 if no orders found
                }

                return ResponseEntity.ok(report);  // Return the report if authorized and orders are found
            } else {
                return ResponseEntity.status(403).body("You are not authorized to view this report.");
            }
        } else {
            return ResponseEntity.status(403).body("You are not authorized to view this report.");
        }
    }

}
