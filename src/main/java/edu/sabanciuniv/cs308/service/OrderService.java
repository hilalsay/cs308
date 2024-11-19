package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(UUID id) {
        return orderRepository.findById(id);
    }

    public void deleteAll() {
        orderRepository.deleteAll();
    }

    public boolean deleteById(UUID id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Method to update the order status
    public Order updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status); // Set the new status
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order); // Save and return the updated order
    }

    // Simulate the delivery process
    public Order simulateDelivery(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Simulate the delivery process (you can add additional logic here)
        order.setOrderStatus(OrderStatus.DELIVERED); // Update status to DELIVERED

        // Save and return the updated order
        return orderRepository.save(order);
    }

    public Order createOrder(Order order) {
        // You can modify this logic to fit your validation and order creation process
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order); // Save the new order to the database
    }
}
