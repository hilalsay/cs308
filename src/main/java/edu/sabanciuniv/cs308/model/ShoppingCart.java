package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class ShoppingCart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;



    @OneToMany(mappedBy = "shoppingCart")
    @JsonManagedReference // Add this annotation to manage the serialization
    private List<CartItem> items;

    @Column(nullable = false)
    private UUID userId;  // Unique ID for the user

    @Column(nullable = false)
    private BigDecimal total;  // Total price of the cart

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public ShoppingCart() {
        this.total = BigDecimal.ZERO;
    }
}