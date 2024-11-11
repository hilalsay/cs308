package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.repo.CartItemRepo;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductRepo productRepo;

    // Retrieves the shopping cart by user ID
    public Optional<ShoppingCart> getCartByUserId(UUID userId) {
        return shoppingCartRepo.findByUserId(userId);
    }

    // Creates a new shopping cart for a user
    public ShoppingCart createShoppingCartForUser(UUID userId) {
        // Check if the user already has a shopping cart
        Optional<ShoppingCart> existingCart = shoppingCartRepo.findByUserId(userId);
        if (existingCart.isPresent()) {
            throw new RuntimeException("User already has an existing shopping cart");
        }

        // Create a new shopping cart if none exists
        ShoppingCart newCart = new ShoppingCart();
        newCart.setUserId(userId);
        newCart.setTotal(BigDecimal.ZERO); // Set the initial total to 0
        newCart.setCreatedAt(LocalDateTime.now());
        newCart.setModifiedAt(LocalDateTime.now());

        // Save the new cart to the database
        return shoppingCartRepo.save(newCart);
    }

    // Adds a product to the cart by product ID
    public ShoppingCart addItemToCart(UUID userId, UUID productId, Integer quantity) {
        ShoppingCart cart = shoppingCartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User's cart not found"));

        // Find the product in the repository
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the product already exists in the cart
        Optional<CartItem> existingCartItem = cartItemRepo.findByShoppingCartAndProduct(cart, product);

        if (existingCartItem.isPresent()) {
            // If the product is already in the cart, update the quantity
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity); // Update the quantity
            cartItemRepo.save(cartItem);
        } else {
            // If the product is not in the cart, create a new CartItem
            CartItem newCartItem = new CartItem(product, quantity, cart);
            cartItemRepo.save(newCartItem);
        }

        // Recalculate the total price of the cart
        cart.setTotal(cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        // Save the updated cart
        return shoppingCartRepo.save(cart);
    }

    // Removes an item from the cart by item ID
    public ShoppingCart removeItemFromCart(UUID userId, UUID itemId) {
        ShoppingCart cart = shoppingCartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User's cart not found"));

        // Find the CartItem to remove
        CartItem cartItem = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Remove the CartItem from the cart
        cart.getItems().remove(cartItem);
        cartItemRepo.delete(cartItem);

        // Recalculate the total price of the cart
        cart.setTotal(cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        // Save the updated cart
        return shoppingCartRepo.save(cart);
    }

    public List<ShoppingCart> getAllCarts() {
        return shoppingCartRepo.findAll();
    }
}
