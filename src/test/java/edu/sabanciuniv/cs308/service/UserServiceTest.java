package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.repo.UserRepo;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private ShoppingCartRepo shoppingCartRepo;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_Success() {
        User user = new User("John Doe", "john@example.com", "password123");
        user.setUsername("johndoe");

        // Mock the repository responses
        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(userRepo.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(userRepo.save(any(User.class))).thenReturn(user);

        ShoppingCart mockCart = new ShoppingCart();
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Call the method under test
        String result = userService.registerUser(user);

        // Assert the results
        assertEquals("User registered successfully!", result);

        // Verify the interactions
        verify(userRepo, times(1)).save(user);
        verify(shoppingCartRepo, times(1)).save(any(ShoppingCart.class));
    }


    @Test
    void registerUser_UsernameExists() {
        User user = new User("John Doe", "john@example.com", "password123");
        user.setUsername("johndoe");

        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        String result = userService.registerUser(user);

        assertEquals("Username is already taken!", result);
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void registerUser_EmailExists() {
        User user = new User("John Doe", "john@example.com", "password123");
        user.setUsername("johndoe");

        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(userRepo.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        String result = userService.registerUser(user);

        assertEquals("Email is already registered!", result);
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void loginUser_Success() {
        User user = new User("John Doe", "john@example.com", encoder.encode("password123"));
        user.setUsername("johndoe");

        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user.getUsername())).thenReturn("mock-jwt-token");

        String token = userService.loginUser(user.getUsername(), "password123");

        assertEquals("mock-jwt-token", token);
    }

    @Test
    void loginUser_UserNotFound() {
        when(userRepo.findByUsername("johndoe")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loginUser("johndoe", "password123"));
    }

    @Test
    void loginUser_InvalidPassword() {
        User user = new User("John Doe", "john@example.com", encoder.encode("password123"));
        user.setUsername("johndoe");

        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        assertThrows(BadCredentialsException.class, () -> userService.loginUser("johndoe", "wrongpassword"));
    }

    @Test
    void getAllUsers() {
        userService.getAllUsers();
        verify(userRepo, times(1)).findAll();
    }

    @Test
    void getUserIdByUsername_Success() {
        User user = new User("John Doe", "john@example.com", "password123");
        user.setId(UUID.randomUUID());
        user.setUsername("johndoe");

        when(userRepo.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        UUID result = userService.getUserIdByUsername(user.getUsername());
        assertEquals(user.getId(), result);
    }

    @Test
    void getUserIdByUsername_UserNotFound() {
        when(userRepo.findByUsername("johndoe")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUserIdByUsername("johndoe"));
    }
}
