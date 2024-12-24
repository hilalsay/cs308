package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class RefundRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundStatus status; // PENDING, APPROVED, REJECTED

    @Column(nullable = false)
    private BigDecimal refundAmount; // Reflect discounted price

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Column(nullable = false)
    private LocalDateTime purchaseDate;

    @Column(nullable = false)
    private boolean isWithinTimeLimit;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    public RefundRequest() {
        this.requestDate = LocalDateTime.now();
    }
}
