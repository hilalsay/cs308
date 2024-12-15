package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.SalesManagerRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    // Generate a report of delivered products
    public String generateDeliveredProductsReport() {
        List<Order> deliveredOrders = viewDeliveredProducts();

        if (deliveredOrders.isEmpty()) {
            return "No delivered orders found.";
        }

        return deliveredOrders.stream()
                .map(order -> String.format(
                        "Order ID: %s\nOrderer: %s\nTotal Amount: %s\nDelivery Address: %s\n\n",
                        order.getId(), order.getOrdererName(), order.getTotalAmount(), order.getOrderAddress()
                ))
                .collect(Collectors.joining());
    }

    // Fetch delivered orders
    public List<Order> viewDeliveredProducts() {
        return orderRepo.findDeliveredOrders();
    }

    // Assign sales manager role to a user
    public void assignSalesManagerRole(UUID userId) {
        // Check if the user exists
        var user = userRepo.findById(userId).orElse(null);
        if (user != null) {
            SalesManager salesManager = new SalesManager();
            salesManager.setUser(user); // Assign the user to the product manager
            salesManagerRepo.save(salesManager); // Save the updated user with the new role
        }
    }


}
