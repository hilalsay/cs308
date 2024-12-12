package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Wishlist;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.UserService;
import edu.sabanciuniv.cs308.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;
    @Autowired
    private JwtService jwtService;  // Inject JwtService
    @Autowired
    private UserService userService;
    // Helper method to extract userId from the authenticated token
    private UUID getCurrentUserId( String token) {
        // Assuming you have a custom UserDetails implementation with the userId stored in it
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = jwtService.extractUserName(token.substring(7)); // Skip "Bearer " prefix
        UUID userId = userService.getUserIdByUsername(username);
        return userId;  // Assuming username is the userId
    }

    // Get the wishlist for the current authenticated user
    @GetMapping("/me")
    public ResponseEntity<Wishlist> getWishlistForCurrentUser(@RequestHeader("Authorization") String token) {
        UUID userId = getCurrentUserId(token);
        Wishlist wishlist = wishlistService.getWishlistByUserId(userId);
        if (wishlist != null) {
            return new ResponseEntity<>(wishlist, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Add a product to the current user's wishlist
    @PostMapping("/me/add/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(@RequestHeader("Authorization") String token,@PathVariable UUID productId) {
        UUID userId = getCurrentUserId(token);
        try {
            Wishlist updatedWishlist = wishlistService.addProductToWishlist(userId, productId);
            return new ResponseEntity<>(updatedWishlist, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Remove a product from the current user's wishlist
    @DeleteMapping("/me/remove/{productId}")
    public ResponseEntity<Wishlist> removeProductFromWishlist(@RequestHeader("Authorization") String token,@PathVariable UUID productId) {
        UUID userId = getCurrentUserId(token);
        try {
            Wishlist updatedWishlist = wishlistService.removeProductFromWishlist(userId, productId);
            return new ResponseEntity<>(updatedWishlist, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Clear all products in the current user's wishlist
    @DeleteMapping("/me/clear")
    public ResponseEntity<Void> clearWishlist(@RequestHeader("Authorization") String token) {
        UUID userId = getCurrentUserId(token);
        wishlistService.clearWishlist(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Confirm order based on the wishlist for the current user
    @PostMapping("/me/confirmOrder")
    public ResponseEntity<Wishlist> confirmOrderFromWishlist(
            @RequestHeader("Authorization") String token,
            @RequestParam String paymentMethod,
            @RequestParam String ordererName,
            @RequestParam String address) {
        UUID userId = getCurrentUserId(token);
        try {
            Wishlist confirmedWishlist = wishlistService.confirmOrderFromWishlist(userId, paymentMethod, ordererName, address);
            return new ResponseEntity<>(confirmedWishlist, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get product info from the current user's wishlist
    @GetMapping("/me/product/{productId}")
    public ResponseEntity<Product> getProductInfoFromWishlist(@RequestHeader("Authorization") String token,@PathVariable UUID productId) {
        UUID userId = getCurrentUserId(token);
        Product product = wishlistService.getProductInfoFromWishlist(userId, productId);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all products in the current user's wishlist
    @GetMapping("/me/products")
    public ResponseEntity<List<Product>> getAllProductsInWishlist(@RequestHeader("Authorization") String token) {
        UUID userId = getCurrentUserId(token);
        List<Product> products = wishlistService.getAllProductsInWishlist(userId);
        if (!products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
