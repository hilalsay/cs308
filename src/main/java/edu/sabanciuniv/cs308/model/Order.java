package edu.sabanciuniv.cs308.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "`order`")
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Creates a foreign key to User
    private User user;

    @Column(nullable = false)
    private UUID shop_id;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "total_amount", nullable = false, precision = 38, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(nullable = false)
    private String ordererName;

    @Column(nullable = false)
    private String orderAddress;

    /**
     *     // Adding Many-to-Many relationship with Product
     *     @ManyToMany
     *     @JoinTable(
     *             name = "order_products",
     *             joinColumns = @JoinColumn(name = "order_id"),
     *             inverseJoinColumns = @JoinColumn(name = "product_id")
     *     )
     *     private List<Product> products; // List of products in this order
     */
}