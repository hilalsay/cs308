package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Data
@Entity
@AllArgsConstructor
public class ShoppingCart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToMany(mappedBy = "shoppingCart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CartItem> items;

    @Column(nullable = false)
    private UUID userId;  // Unique ID for the user

    @Column(nullable = false)
    private BigDecimal total;  // Total price of the cart

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    @Column(nullable = false)
    private boolean ordered = false;  // Flag to check if the cart is ordered

    public ShoppingCart() {
        this.total = BigDecimal.ZERO;
    }

    public UUID getUserId() {
        return userId;
    }
}
