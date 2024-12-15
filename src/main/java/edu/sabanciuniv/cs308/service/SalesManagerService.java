package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.model.SalesManager;
import edu.sabanciuniv.cs308.model.User;
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
        // Verify user exists
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        // Assign role logic
        User user = userOptional.get();
        user.setRole("SALES_MANAGER");
        userRepo.save(user);
    }

}
