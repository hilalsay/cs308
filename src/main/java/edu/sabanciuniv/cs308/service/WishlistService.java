package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.Wishlist;
import edu.sabanciuniv.cs308.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
public class WishlistService {

    @Autowired
    private edu.sabanciuniv.cs308.repository.WishlistRepo wishlistRepository;

    @Autowired
    private ProductService productService; // Assume this service retrieves products

    @Autowired
    private UserService userService; // Assume you have a UserService to retrieve users by ID

    public Wishlist getWishlistByUserId(UUID userId) {
        return wishlistRepository.findByUser(userService.getUserById(userId))
                .orElse(null); // Return null if no wishlist found
    }

    public Wishlist addProductToWishlist(UUID userId, UUID productId) {
        Product product = productService.getProductById(productId);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist == null) {
            wishlist = new Wishlist();
            User user = userService.getUserById(userId);
            wishlist.setUser(user); // Setting the user object
        }
        wishlist.getProducts().add(product);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeProductFromWishlist(UUID userId, UUID productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist != null) {
            wishlist.getProducts().removeIf(product -> product.getId().equals(productId));
            return wishlistRepository.save(wishlist);
        }
        throw new RuntimeException("Wishlist not found");
    }

    public void clearWishlist(UUID userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist != null) {
            wishlist.getProducts().clear();
            wishlistRepository.save(wishlist);
        }
    }

    public Wishlist confirmOrderFromWishlist(UUID userId, String paymentMethod, String ordererName, String address) {
        // Implement order conversion logic (like placing an order based on wishlist)
        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist != null) {
            // Convert wishlist to order here...
            return wishlist;
        }
        throw new RuntimeException("Wishlist not found");
    }

    public Product getProductInfoFromWishlist(UUID userId, UUID productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist != null) {
            return wishlist.getProducts().stream()
                    .filter(product -> product.getId().equals(productId))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    public List<Product> getAllProductsInWishlist(UUID userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        return wishlist != null ? List.copyOf(wishlist.getProducts()) : List.of();
    }
}
