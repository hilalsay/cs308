// ShoppingCartService.java
package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    // Retrieves the shopping cart by user ID
    public Optional<ShoppingCart> getCartByUserId(UUID userId) {
        return shoppingCartRepo.findByUserId(userId);
    }

    // Method to retrieve ShoppingCart by its ID
    public ShoppingCart getShoppingCartById(UUID cartId) {
        Optional<ShoppingCart> shoppingCart = shoppingCartRepo.findById(cartId);
        if (shoppingCart.isPresent()) {
            return shoppingCart.get();
        } else {
            throw new RuntimeException("ShoppingCart not found with id " + cartId);
        }
    }

    // Creates a new shopping cart for a user if it does not exist
    public ShoppingCart createShoppingCartForUser(UUID userId) {
        Optional<ShoppingCart> existingCart = shoppingCartRepo.findByUserId(userId);

        // Check if there is an unprocessed cart for the user
        if (existingCart.isPresent() && !existingCart.get().isOrdered()) {
            throw new RuntimeException("User already has an existing unprocessed shopping cart");
        }

        ShoppingCart newCart = new ShoppingCart();
        newCart.setUserId(userId);
        newCart.setTotal(BigDecimal.ZERO);
        newCart.setCreatedAt(LocalDateTime.now());
        newCart.setModifiedAt(LocalDateTime.now());
        newCart.setOrdered(false);

        newCart.setItems(new ArrayList<>());

        return shoppingCartRepo.save(newCart);
    }
    public ShoppingCart addItemToCart(UUID userId, UUID productId, Integer quantity) {
        // Check if there is an existing unordered shopping cart

        ShoppingCart cart = shoppingCartRepo.findByUserIdAndOrderedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Shoppinng cart not found")); // Create a new cart if not found

        // Find the product by productId
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the product is already in the cart
        Optional<CartItem> existingCartItem = cartItemRepo.findByShoppingCartAndProduct(cart, product);

        if (existingCartItem.isPresent()) {
            // If the product is already in the cart, update the quantity
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepo.save(cartItem);
        } else {
            // If the product is not in the cart, create a new CartItem
            CartItem newCartItem = new CartItem(product, quantity, cart);
            cartItemRepo.save(newCartItem);
        }

        // Update the total price of the cart
        updateCartTotal(cart);

        // Save and return the updated cart
        return shoppingCartRepo.save(cart);
    }


    public ShoppingCart removeItemFromCart(UUID userId, UUID productId) {
        // Kullanıcıya ait 'ordered' değeri false olan sepete erişim
        ShoppingCart cart = shoppingCartRepo.findByUserIdAndOrderedFalse(userId)
                .orElseThrow(() -> new RuntimeException("No unordered shopping cart found for user: " + userId));

        // Find the product by productId
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Ürünü cartItemRepo ile sepetin içerisindeki itemId'ye göre bulma
        Optional<CartItem> existingCartItem = cartItemRepo.findByShoppingCartAndProduct(cart, product);

        if (!existingCartItem.isPresent()) {
            throw new RuntimeException("Product not found in the cart for user: " + userId);
        }

        CartItem cartItem = existingCartItem.get();

        // Eğer ürünün miktarı 1'den büyükse, miktarı 1 azalt
        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            cartItemRepo.save(cartItem);
        } else {
            // Eğer miktar 1 ise, ürünü tamamen sil
            cart.getItems().remove(cartItem);
            cartItemRepo.delete(cartItem);
        }

        // Sepet toplamını güncelle
        updateCartTotal(cart);

        // Sepeti veritabanında kaydet
        return shoppingCartRepo.save(cart);
    }



    // Updates the total price of a shopping cart
    private void updateCartTotal(ShoppingCart cart) {
        cart.setTotal(cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    // Retrieves all shopping carts
    public List<ShoppingCart> getAllCarts() {
        return shoppingCartRepo.findAll();
    }

    // Deletes all shopping carts and their associated items
    public void deleteAllShoppingCarts() {
        cartItemRepo.deleteAll();
        shoppingCartRepo.deleteAll();
    }

    // Method to convert shopping cart to an order
    public Order convertToOrder(UUID userId, String paymentMethod) {
        // Ensure the shopping cart is not null
        // Check if there is an existing unordered shopping cart
        ShoppingCart shoppingCart = shoppingCartRepo.findByUserIdAndOrderedFalse(userId)
                .orElseThrow(() -> new RuntimeException("No unordered shopping cart found for user: " + userId));

        if (shoppingCart == null || shoppingCart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Shopping cart is empty");
        }

        // Set the ordered flag to true
        shoppingCart.setOrdered(true);
        shoppingCartRepo.save(shoppingCart);

        ShoppingCart newCart = new ShoppingCart();
        newCart.setUserId(userId);
        newCart.setTotal(BigDecimal.ZERO);
        newCart.setCreatedAt(LocalDateTime.now());
        newCart.setModifiedAt(LocalDateTime.now());
        newCart.setOrdered(false);

        newCart.setItems(new ArrayList<>());

        shoppingCartRepo.save(newCart);

        // Create a new order based on the shopping cart
        Order order = new Order();
        User user = userRepo.findById(shoppingCart.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        order.setUser(user); // Associate the order with the user
        order.setShop_id(shoppingCart.getId());
        order.setTotalAmount(shoppingCart.getTotal()); // Set the total amount from the shopping cart
        order.setOrderStatus(OrderStatus.PROCESSING); // Initially, set the status to Processing
        order.setCreatedAt(LocalDateTime.now()); // Set the creation time
        order.setUpdatedAt(LocalDateTime.now()); // Set the last updated time
        order.setPaymentMethod(paymentMethod); // Set the payment method from the user input

        // If payment is confirmed, set the payment date (for simplicity, we assume payment is done)
        order.setPaymentDate(LocalDateTime.now());

        // Update product quantities for each CartItem in the order
        for (CartItem cartItem : shoppingCart.getItems()) {
            Product product = cartItem.getProduct();

            // Decrease the stock quantity of the product by the quantity ordered
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());

            // Save the updated product
            productRepo.save(product);
        }

        // Save the order to the repository
        return orderRepo.save(order); // Return the saved order
    }
    public Optional<ShoppingCart> getUnorderedCartByUserId(UUID userId) {
        return shoppingCartRepo.findByUserIdAndOrderedFalse(userId);
    }

    public List<ShoppingCart> getAllCartsByUserId(UUID userId) {
        return shoppingCartRepo.findAllByUserId(userId);
    }
    public List<ShoppingCart> getOrderedCartsByUserId(UUID userId) {
        return shoppingCartRepo.findByUserIdAndOrderedTrue(userId);
    }



}


