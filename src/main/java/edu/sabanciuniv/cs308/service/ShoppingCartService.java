package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShoppingCartService {

    private final ShoppingCartRepo shoppingCartRepo;
    private final ProductRepo productRepo;
    private final OrderRepo orderRepo;
    private final DeliveryRepo deliveryRepo;
    private final UserRepo userRepo;

    @Autowired
    public ShoppingCartService(ShoppingCartRepo shoppingCartRepo, ProductRepo productRepo, OrderRepo orderRepo, DeliveryRepo deliveryRepo, UserRepo userRepo) {
        this.shoppingCartRepo = shoppingCartRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.deliveryRepo = deliveryRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public String checkout(User userId, String paymentMethod) {
        // Fetch the user's shopping cart
        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findByUser(userId);

        if (cartOpt.isEmpty()) {
            return "Shopping cart not found!";
        }

        ShoppingCart cart = cartOpt.get();

        // Calculate the total amount of the order
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct(productRepo);  // Get the actual product using the repo

            if (product == null) {
                return "Product not found!";
            }

            // Calculate total price for the cart item
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

            // Check if there is enough stock
            int availableStock = product.getStockQuantity();
            int quantityRequested = item.getQuantity();

            // Ensure the stock is sufficient
            if (availableStock >= quantityRequested) {
                // Update the stock
                product.setStockQuantity(availableStock - quantityRequested);
                productRepo.save(product);  // Save the updated product to the database
            } else {
                // Handle the case where there is not enough stock
                return "Not enough stock for product: " + product.getName();  // Return an error message
            }
        }

        // Create a new order
        Order order = new Order();
        order.setUser(userId);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPaymentMethod(paymentMethod);
        order.setPaymentDate(LocalDateTime.now());

        orderRepo.save(order);  // Save the new order

        // Create a delivery entry (you can adjust the shipping method)
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setShippingMethod("Standard");
        delivery.setDeliveryStatus("Processing");
        delivery.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(5));  // Example: 5 days from now
        delivery.setCreatedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());

        deliveryRepo.save(delivery);  // Save the delivery entry

        // Clear the shopping cart (or mark as processed)
        cart.getItems().clear();  // Optionally delete the cart items
        shoppingCartRepo.save(cart);  // Save the empty cart or update the cart's state

        return "Checkout successful!";
    }
}
