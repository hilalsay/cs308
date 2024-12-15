package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sales_manager")
public class SalesManager {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "salesManager")
    private List<Order> managedOrders;

    // Constructor
    public SalesManager(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    @Column(nullable = false)
    private String role = "SALES_MANAGER";

    @Transactional
    public List<Order> viewDeliveredProducts(List<Order> allOrders) {
        return allOrders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.DELIVERED)
                .toList();
    }

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) // Connection with User
    private User user;

}
