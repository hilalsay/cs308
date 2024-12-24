package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepository;


    @Autowired
    private SalesManagerRepo salesManagerRepo;

    @Autowired
    private RefundRequestRepo refundRequestRepo;
    @Autowired
    private ShoppingCartRepo shoppingCartRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UserRepo userRepo;

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
    /**
     * Fetch all orders for a specific user.
     *
     * @param userId the ID of the user whose orders are being retrieved.
     * @return a list of orders belonging to the specified user.
     */
    public List<Order> findOrdersByUserId(UUID userId) {
        return orderRepository.findByUserId(userId);
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
    // Simulate the delivery process
    public Order simulateTransit(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Simulate the delivery process (you can add additional logic here)
        order.setOrderStatus(OrderStatus.IN_TRANSIT); // Update status to DELIVERED

        // Save and return the updated order
        return orderRepository.save(order);
    }
    public Order createOrder(Order order) {
        // You can modify this logic to fit your validation and order creation process
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order); // Save the new order to the database
    }
    public RefundRequest requestRefund(UUID orderId, UUID productId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Refund is allowed only for delivered orders.");
        }

        LocalDateTime purchaseDate = order.getCreatedAt();
        boolean withinTimeLimit = purchaseDate.plusDays(30).isAfter(LocalDateTime.now());

        if (!withinTimeLimit) {
            throw new RuntimeException("Refund request exceeds the 30-day limit.");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));



        RefundRequest refundRequest = new RefundRequest();
        refundRequest.setOrder(order);
        refundRequest.setProduct(product);
        refundRequest.setRefundAmount(product.getPrice());
        refundRequest.setPurchaseDate(purchaseDate);
        refundRequest.setWithinTimeLimit(true);
        refundRequest.setStatus(RefundStatus.PENDING);

        return refundRequestRepo.save(refundRequest);
    }

    public RefundRequest approveRefund(UUID refundRequestId, UUID userId) {
        RefundRequest refundRequest = refundRequestRepo.findById(refundRequestId)
                .orElseThrow(() -> new RuntimeException("Refund request not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user's role is SALES_MANAGER
        if (!"SALES_MANAGER".equals(user.getRole())) {
            throw new RuntimeException("User is not authorized to approve refunds");
        }

        refundRequest.setStatus(RefundStatus.APPROVED);
        refundRequest.setApprovedBy(user); // Assuming `RefundRequest` has a reference to User as `approvedBy`

        return refundRequestRepo.save(refundRequest);
    }


    public List<RefundRequest> viewRefundRequests() {
        return refundRequestRepo.findAllByStatus(RefundStatus.PENDING);

    public Order getOrderById(UUID orderId) {
        // Fetch the order by its UUID from the database
        Optional<Order> order = orderRepository.findById(orderId);

        // If order is found, return it; otherwise, throw an exception or return null
        return order.orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
    }
}
