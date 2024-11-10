package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;


import java.math.BigDecimal;

@Data
@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;  // Reference to the Product entity

    private Integer quantity; // Quantity of the product in the cart
    private BigDecimal price; // Price at the time of adding to the cart (in case it changes later)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference // Add this annotation to prevent recursive serialization of shoppingCart
    private ShoppingCart shoppingCart; // Reference to the associated ShoppingCart

    public CartItem() {
    }


    public CartItem(Product product, Integer quantity, ShoppingCart shoppingCart) {
        this.product = product;
        this.quantity = quantity;
        this.price = product.getPrice(); // Set price to the product's price
        this.shoppingCart = shoppingCart;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.modifiedAt = LocalDateTime.now(); // Update modifiedAt when quantity changes
    }
    
}
