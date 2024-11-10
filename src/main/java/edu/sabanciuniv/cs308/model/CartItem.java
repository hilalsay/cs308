package edu.sabanciuniv.cs308.model;

import edu.sabanciuniv.cs308.repo.ProductRepo;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart shoppingCart;

    @Column(nullable = false)
    private UUID productId; // ID of the product added to the cart

    private int quantity; // Quantity of the product


    // Constructor for ease of creating new CartItems
    public CartItem(ShoppingCart shoppingCart, UUID productId, int quantity, BigDecimal price) {
        this.shoppingCart = shoppingCart;
        this.productId = productId;
        this.quantity = quantity;

    }

    public CartItem() {
    }

    // Method to get the actual Product object from the productId
    public Product getProduct(ProductRepo productRepo) {
        // Assuming ProductRepo is passed into this method
        return productRepo.findById(this.productId).orElse(null);  // Fetch the product by productId, or return null if not found
    }
}
