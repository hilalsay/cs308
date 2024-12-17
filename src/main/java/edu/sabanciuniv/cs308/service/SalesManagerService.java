package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.SalesManagerRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SalesManagerService {

    private final SalesManagerRepo salesManagerRepo;
    private final UserRepo userRepo;
    private final OrderRepo orderRepo;

    @Autowired
    public SalesManagerService(SalesManagerRepo salesManagerRepo, UserRepo userRepo, OrderRepo orderRepo) {
        this.salesManagerRepo = salesManagerRepo;
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
    }

    // Generate a report of all delivered products for the Sales Manager
    public String generateDeliveredProductsReport(UUID userId) {
        // Check if the user exists
        var user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return "User not found."; // Return a proper error message
        }

        // Check if the user has the 'SALES_MANAGER' role
        if (!user.getRole().equalsIgnoreCase("SALES_MANAGER")) {
            return "You are not authorized to view this report."; // Only allow SALES_MANAGER to view this report
        }

        // Fetch all delivered orders from the repository (for all users in the system)
        List<Order> deliveredOrders = viewDeliveredProducts(); // This method should return all delivered orders

        if (deliveredOrders.isEmpty()) {
            return "No delivered orders found."; // Return a message if no delivered orders exist
        }

        // Return formatted delivered orders as a report string
        return deliveredOrders.stream()
                .map(order -> String.format(
                        "Order ID: %s\nOrderer: %s\nTotal Amount: %s\nDelivery Address: %s\n\n",
                        order.getId(), order.getOrdererName(), order.getTotalAmount(), order.getOrderAddress()
                ))
                .collect(Collectors.joining());
    }

    public List<Order> viewDeliveredProducts() {
        return orderRepo.findByOrderStatus(OrderStatus.DELIVERED);
    }
}