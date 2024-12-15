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
        // Check if the user exists and has the 'SALES_MANAGER' role
        var user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return "User not found.";
        }

        // Check if the user has the 'SALES_MANAGER' role
        if (!user.getRole().equals("SALES_MANAGER")) {
            return "You are not authorized to view this report.";
        }

        // Fetch all delivered orders from the repository (for all users)
        List<Order> deliveredOrders = viewDeliveredProducts();

        if (deliveredOrders.isEmpty()) {
            return "No delivered orders found.";
        }

        // Return formatted delivered orders
        return deliveredOrders.stream()
                .map(order -> String.format(
                        "Order ID: %s\nOrderer: %s\nTotal Amount: %s\nDelivery Address: %s\n\n",
                        order.getId(), order.getOrdererName(), order.getTotalAmount(), order.getOrderAddress()
                ))
                .collect(Collectors.joining());
    }

    // Fetch all delivered orders from the repository
    public List<Order> viewDeliveredProducts() {
        return orderRepo.findDeliveredOrders();  // Assume this method returns delivered orders
    }

    // Assign sales manager role to a user
    public void assignSalesManagerRole(UUID userId) {
        // Check if the user exists
        var user = userRepo.findById(userId).orElse(null);
        if (user != null) {
            // Assign the user as a Sales Manager
            SalesManager salesManager = new SalesManager();
            salesManager.setUser(user);
            salesManagerRepo.save(salesManager);  // Save the updated user with the Sales Manager role
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }
}
