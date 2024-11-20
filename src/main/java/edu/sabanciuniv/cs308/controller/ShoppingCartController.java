// ShoppingCartController.java
package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    // Endpoint to get all carts
    @GetMapping("/all")
    public ResponseEntity<List<ShoppingCart>> getAllCarts() {
        List<ShoppingCart> carts = shoppingCartService.getAllCarts();
        return ResponseEntity.ok(carts);
    }

    // Endpoint to delete all shopping carts
    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllCarts() {
        shoppingCartService.deleteAllShoppingCarts();
        return ResponseEntity.ok("All shopping carts and their items have been deleted.");
    }

    // Endpoint to view the user's unordered shopping cart by user ID
    @GetMapping("/view/{userId}")
    public ResponseEntity<ShoppingCart> viewCart(@PathVariable UUID userId) {
        return shoppingCartService.getUnorderedCartByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint to create a shopping cart for a user (if it doesn't exist)
    @PostMapping("/create/{userId}")
    public ResponseEntity<ShoppingCart> createCart(@PathVariable UUID userId) {
        try {
            ShoppingCart cart = shoppingCartService.createShoppingCartForUser(userId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint to add an item to the cart
    @PostMapping("/add/{userId}/{productId}/{quantity}")
    public ResponseEntity<ShoppingCart> addItemToCart(
            @PathVariable UUID userId,
            @PathVariable UUID productId,
            @PathVariable Integer quantity) {
        try {
            ShoppingCart cart = shoppingCartService.addItemToCart(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint to remove an item from the cart
    @DeleteMapping("/remove/{userId}/{itemId}")
    public ResponseEntity<ShoppingCart> removeItemFromCart(@PathVariable UUID userId, @PathVariable UUID itemId) {
        try {
            ShoppingCart cart = shoppingCartService.removeItemFromCart(userId, itemId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



    // Endpoint to show all shopping carts of a user
    @GetMapping("/all/{userId}")
    public ResponseEntity<List<ShoppingCart>> getAllCartsByUserId(@PathVariable UUID userId) {
        List<ShoppingCart> carts = shoppingCartService.getAllCartsByUserId(userId);
        return ResponseEntity.ok(carts);
    }

    // Endpoint to show ordered shopping carts of a user
    @GetMapping("/ordered/{userId}")
    public ResponseEntity<List<ShoppingCart>> getOrderedCartsByUserId(@PathVariable UUID userId) {
        List<ShoppingCart> carts = shoppingCartService.getOrderedCartsByUserId(userId);
        return ResponseEntity.ok(carts);
    }

    // Method to confirm shopping cart as an order
    @PostMapping("/{cartId}/confirm")
    public ResponseEntity<Order> confirmOrder(@PathVariable UUID cartId, @RequestParam String paymentMethod) {
        try {
            ShoppingCart shoppingCart = shoppingCartService.getShoppingCartById(cartId);
            Order order = shoppingCartService.convertToOrder(shoppingCart, paymentMethod);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
