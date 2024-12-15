package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    // Additional custom query methods if needed
    List<Order> findByUserId(UUID userId);
    Optional<Order> findById(UUID orderId);

    // Custom query to find delivered orders
    @Query("SELECT o FROM Order o WHERE o.orderStatus = 'DELIVERED'")
    List<Order> findDeliveredOrders();
}