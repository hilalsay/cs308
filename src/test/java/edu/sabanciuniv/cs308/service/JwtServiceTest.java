package edu.sabanciuniv.cs308.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_ShouldGenerateValidToken() {
        String username = "testuser";

        String token = jwtService.generateToken(username);

        assertNotNull(token, "Generated token should not be null");
        assertFalse(token.isEmpty(), "Generated token should not be empty");

        // Validate that the token contains the correct username
        String extractedUsername = jwtService.extractUserName(token);
        assertEquals(username, extractedUsername, "Extracted username should match the input username");
    }

    @Test
    void extractUserName_ShouldExtractCorrectUsername() {
        String username = "testuser";

        String token = jwtService.generateToken(username);
        String extractedUsername = jwtService.extractUserName(token);

        assertEquals(username, extractedUsername, "Extracted username should match the input username");
    }

    @Test
    void validateToken_ShouldReturnTrueForValidToken() {
        String username = "validuser";

        String token = jwtService.generateToken(username);
        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        boolean isValid = jwtService.validateToken(token, userDetails);

        assertTrue(isValid, "Token validation should return true for a valid token and user");
    }

    @Test
    void validateToken_ShouldReturnFalseForInvalidToken() {
        String username = "validuser";

        String token = jwtService.generateToken(username);
        UserDetails userDetails = new User("differentuser", "password", Collections.emptyList());

        boolean isValid = jwtService.validateToken(token, userDetails);

        assertFalse(isValid, "Token validation should return false for a token with mismatched username");
    }

    @Test
    void isTokenExpired_ShouldReturnFalseForExpiredToken() {
        String username = "expireduser";

        // Manually create an expired token
        String expiredToken = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60)) // Issued 1 hour ago
                .setExpiration(new Date(System.currentTimeMillis() - 1000 * 60)) // Expired 1 minute ago
                .signWith(jwtService.getKey())
                .compact();

        assertFalse(jwtService.validateToken(expiredToken, new User(username, "password", Collections.emptyList())),
                "Token validation should fail for expired tokens");
    }


    @Test
    void isTokenExpired_ShouldReturnFalseForValidToken() {
        String username = "validuser";
        User user = new User(username, "password", Collections.emptyList());

        String token = jwtService.generateToken(username);

        assertTrue(jwtService.validateToken(token, user),
                "Token validation should pass for valid tokens");
    }

}
