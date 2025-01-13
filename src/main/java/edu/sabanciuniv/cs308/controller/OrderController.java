package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.model.RefundRequest;
import edu.sabanciuniv.cs308.service.InvoiceService;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.OrderService;
import edu.sabanciuniv.cs308.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    // Endpoint to view all orders


    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    @GetMapping("/paged")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            // Determine sort direction
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

            // Create Pageable with sort
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            // Fetch paginated and sorted orders
            Page<Order> ordersPage = orderService.findAllPaginated(pageable);
            return new ResponseEntity<>(ordersPage, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/user/orders")
    public ResponseEntity<?> getOrdersByUser(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Fetch orders belonging to the user
            List<Order> userOrders = orderService.findOrdersByUserId(userId);
            if (userOrders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found for the user.");
            }

            return ResponseEntity.ok(userOrders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    // Endpoint to delete all orders
    @DeleteMapping
    public ResponseEntity<Void> deleteAllOrders() {
        orderService.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Endpoint to delete an order by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderById(@PathVariable UUID id) {
        if (orderService.deleteById(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);  // Assume createOrder method exists in service
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Handle invalid data input
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Endpoint to update the order status
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable UUID orderId, @RequestBody String status) {
        try {
            // Convert the string status to OrderStatus enum
            OrderStatus orderStatus = OrderStatus.fromString(status);

            // Update the order status
            Order updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.valueOf(String.valueOf(orderStatus)));

            // Return the updated order with a 200 OK response
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // If the status is invalid (invalid status value in the request)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (NoSuchElementException e) {
            // If the order is not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        } catch (Exception e) {
            // Catch any other general exception (e.g., database issues)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    // Endpoint to simulate the delivery process
    @PutMapping("/{orderId}/simulate-delivery")
    public ResponseEntity<Order> simulateDelivery(@PathVariable UUID orderId) {
        try {
            Order updatedOrder = orderService.simulateDelivery(orderId);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Order not found
        }
    }
    // Endpoint to simulate the delivery process
    @PutMapping("/{orderId}/simulate-transit")
    public ResponseEntity<Order> simulateTransit(@PathVariable UUID orderId) {
        try {
            Order updatedOrder = orderService.simulateTransit(orderId);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Order not found
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID orderId) {
        try {
            Order updatedOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(updatedOrder); // Return the updated order as response
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while canceling the order.");
        }
    }
}

