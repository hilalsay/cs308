// ShoppingCartController.java
package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.ShoppingCart;

import edu.sabanciuniv.cs308.model.CartItem;

import edu.sabanciuniv.cs308.service.CartItemService;
import edu.sabanciuniv.cs308.service.InvoiceService;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.ShoppingCartService;
import edu.sabanciuniv.cs308.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {
    @Autowired
    private JwtService jwtService;  // Inject JwtService
    @Autowired
    private UserService userService;
    @Autowired
    private ShoppingCartService shoppingCartService;
    @Autowired
    private InvoiceService invoiceService;

    // Endpoint to get all carts
    @GetMapping("/allcarts")
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
    @GetMapping("/view")
    public ResponseEntity<ShoppingCart> viewCart(@RequestHeader("Authorization") String token) {
        // Extract the user ID or username from the token
        String username = jwtService.extractUserName(token.substring(7)); // Skip "Bearer " prefix
        UUID userId = userService.getUserIdByUsername(username);
        return shoppingCartService.getUnorderedCartByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    // Endpoint to add an item to the cart
    @PostMapping("/add/{productId}/{quantity}")
    public ResponseEntity<?> addItemToCart(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID productId,
            @PathVariable Integer quantity) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Add the item to the user's cart
            ShoppingCart cart = shoppingCartService.addItemToCart(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error:" + e.getMessage()); // Handle runtime errors gracefully
        }
    }


    // Endpoint to remove an item from the cart
    @DeleteMapping("/decrease/{itemId}")
    public ResponseEntity<?> removeItemFromCart(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID itemId) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            ShoppingCart cart = shoppingCartService.removeOneItemFromCart(userId, itemId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to remove a specific product from the cart completely
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeProductFromCart(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID productId) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username);

            // Remove the product from the shopping cart
            ShoppingCart updatedCart = shoppingCartService.removeProductFromCart(userId, productId);
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to delete all products from the shopping cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearShoppingCart(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username);

            // Clear the user's shopping cart
            shoppingCartService.clearCart(userId);
            return ResponseEntity.ok("All products have been removed from your shopping cart.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to create a new shopping cart for the user
    /*@PostMapping("/create")
    public ResponseEntity<ShoppingCart> createShoppingCart(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Create a new shopping cart for the user
            ShoppingCart newCart = shoppingCartService.createShoppingCartForUser(userId);
            return ResponseEntity.ok(newCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Handle errors gracefully
        }
    }*/



    // Endpoint to show all shopping carts of a user
    @GetMapping("/all")
    public ResponseEntity<List<ShoppingCart>> getAllCartsByUserId(
            @RequestHeader("Authorization") String token) {
        // Extract user ID from the token
        String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
        UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

        List<ShoppingCart> carts = shoppingCartService.getAllCartsByUserId(userId);
        return ResponseEntity.ok(carts);
    }

    // Endpoint to show ordered shopping carts of a user
    @GetMapping("/ordered")
    public ResponseEntity<List<ShoppingCart>> getOrderedCartsByUserId(
            @RequestHeader("Authorization") String token) {
        // Extract user ID from the token
        String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
        UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

        List<ShoppingCart> carts = shoppingCartService.getOrderedCartsByUserId(userId);
        return ResponseEntity.ok(carts);
    }

    // Method to confirm shopping cart as an order
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(
            @RequestHeader("Authorization") String token,
            @RequestParam String paymentMethod,
            @RequestParam String ordererName,
            @RequestParam String address) {
        try {
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            Order order = shoppingCartService.convertToOrder(userId, paymentMethod, ordererName, address);
            invoiceService.generateInvoiceAndSendEmail(order.getId());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Endpoint to print all information in a shopping cart
    @GetMapping("/info/{cartId}")
    public ResponseEntity<?> getCartInfo(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID cartId) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Fetch the cart information
            ShoppingCart cart = shoppingCartService.getCartByIdAndUserId(cartId, userId);
            if (cart == null) {
                return ResponseEntity.notFound().build();
            }

            // Print detailed cart information
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/infoCartitem/{cartId}")
    public ResponseEntity<?> getCartitem(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID cartId) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Fetch the cart information
            ShoppingCart cart = shoppingCartService.getCartByIdAndUserId(cartId, userId);
            if (cart == null) {
                return ResponseEntity.notFound().build();
            }

            // Extract the cart items
            List<CartItem> items = cart.getItems();

            // Return the list of products in the shopping cart
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/infoProducts/{cartId}")
    public ResponseEntity<?> getCartProducts(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID cartId) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Fetch the cart information
            ShoppingCart cart = shoppingCartService.getCartByIdAndUserId(cartId, userId);
            if (cart == null) {
                return ResponseEntity.notFound().build();
            }

            // Extract products from the cart
            List<Product> products = cart.getItems().stream()
                    .map(CartItem::getProduct) // Map each CartItem to its Product
                    .toList();

            // Return the list of products in the shopping cart
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/products/{shopId}")
    public ResponseEntity<?> getCartByShopId(@PathVariable UUID shopId) {
        try {
            ShoppingCart cart = shoppingCartService.getCartByShopId(shopId);
            if (cart == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Cart not found for shopId: " + shopId);
            }
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            System.out.println("Error fetching cart: "+ e);  // Log the exception for server-side debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch cart data: " + e.getMessage());
        }
    }



}
