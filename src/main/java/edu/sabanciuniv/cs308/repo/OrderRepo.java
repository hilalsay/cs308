package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    // Custom query to find orders by userId
    List<Order> findByUserId(UUID userId);

    // Custom query to find delivered orders
    @Query("SELECT o FROM Order o WHERE o.orderStatus = 'DELIVERED'")
    List<Order> findDeliveredOrders();

    // If you need to have findByStatus, you can use this method as well
    @Query("SELECT o FROM Order o WHERE o.orderStatus = :status")
    List<Order> findByOrderStatus(OrderStatus status);
}
