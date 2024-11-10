package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    // Endpoint to view the user's shopping cart by user ID
    @GetMapping("/view/{userId}")
    public ShoppingCart viewCart(@PathVariable UUID userId) {
        return shoppingCartService.getCartByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user " + userId));
    }

    // Endpoint to create a shopping cart for a user (if it doesn't exist)
    @PostMapping("/create/{userId}")
    public ShoppingCart createCart(@PathVariable UUID userId) {
        return shoppingCartService.createShoppingCartForUser(userId);
    }

    // Endpoint to add an item to the cart
    @PostMapping("/add/{userId}/{productId}/{quantity}")
    public ShoppingCart addItemToCart(
            @PathVariable UUID userId,
            @PathVariable UUID productId,
            @PathVariable Integer quantity) {
        return shoppingCartService.addItemToCart(userId, productId, quantity);
    }

    // Endpoint to remove an item from the cart
    @DeleteMapping("/remove/{userId}/{itemId}")
    public ShoppingCart removeItemFromCart(@PathVariable UUID userId, @PathVariable UUID itemId) {
        return shoppingCartService.removeItemFromCart(userId, itemId);
    }
}
