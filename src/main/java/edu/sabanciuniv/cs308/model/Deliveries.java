package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Deliveries {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)  // Automatically generates a UUID
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order; // Reference to order

    private String shippingMethod;
    private String trackingNumber;
    private String deliveryStatus;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime actualDeliveryDate;

    @Column(nullable = false)
    private UUID shippingAddressId; // Reference to shipping address

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
