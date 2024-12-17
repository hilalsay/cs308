package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.LoginRequest;
import edu.sabanciuniv.cs308.repo.UserRepo;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.OrderService;
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
    private OrderService orderService;
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

    @GetMapping("/ordered-products")
    public ResponseEntity<List<Order>> getAllOrderedProducts(@RequestHeader("Authorization") String token) {
        // Extract the token value by skipping "Bearer " and trimming any extra spaces
        String jwt = token.substring(7).trim();

        // Decode the token and get the current authenticated user's ID from the token
        String username = jwtService.extractUserName(jwt);
        UUID authenticatedUserId = userService.getUserIdByUsername(username);

        // Fetch the role of the authenticated user (to ensure the user is a sales manager)
        User authenticatedUser = userService.getUserById(authenticatedUserId);

        if (authenticatedUser == null || !authenticatedUser.getRole().equals("SALES_MANAGER")) {
            return ResponseEntity.status(403).body(null); // Forbidden if not a Sales Manager
        }

        // Get all orders
        List<Order> orders = orderService.findAll();

        if (orders.isEmpty()) {
            return ResponseEntity.status(404).body(null); // Return 404 if no orders found
        }

        return ResponseEntity.ok(orders); // Return orders if found
    }
}
