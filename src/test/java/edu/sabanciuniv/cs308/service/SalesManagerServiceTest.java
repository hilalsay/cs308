package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.SalesManager;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.SalesManagerRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SalesManagerServiceTest {

    @Mock
    private SalesManagerRepo salesManagerRepo;

    @Mock
    private UserRepo userRepo;

    @Mock
    private OrderRepo orderRepo;

    @InjectMocks
    private SalesManagerService salesManagerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerateDeliveredProductsReport_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        String result = salesManagerService.generateDeliveredProductsReport(userId);

        assertEquals("User not found.", result);
        verify(userRepo, times(1)).findById(userId);
    }

    @Test
    void testGenerateDeliveredProductsReport_UserNotAuthorized() {
        UUID userId = UUID.randomUUID();
        User user = new User("John Doe", "john@example.com", "password", "CUSTOMER");
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        String result = salesManagerService.generateDeliveredProductsReport(userId);

        assertEquals("You are not authorized to view this report.", result);
        verify(userRepo, times(1)).findById(userId);
    }

    @Test
    void testGenerateDeliveredProductsReport_NoDeliveredOrders() {
        UUID userId = UUID.randomUUID();
        User user = new User("Jane Doe", "jane@example.com", "password", "SALES_MANAGER");
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(orderRepo.findDeliveredOrders()).thenReturn(Collections.emptyList());

        String result = salesManagerService.generateDeliveredProductsReport(userId);

        assertEquals("No delivered orders found.", result);
        verify(orderRepo, times(1)).findDeliveredOrders();
    }

    @Test
    void testGenerateDeliveredProductsReport_Success() {
        UUID userId = UUID.randomUUID();
        User user = new User("Jane Doe", "jane@example.com", "password", "SALES_MANAGER");
        Order order = new Order();
        order.setId(UUID.randomUUID());
        order.setOrdererName("Customer A");
        order.setTotalAmount(BigDecimal.valueOf(150.00));
        order.setOrderAddress("123 Main Street");

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(orderRepo.findDeliveredOrders()).thenReturn(List.of(order));

        String result = salesManagerService.generateDeliveredProductsReport(userId);

        assertTrue(result.contains("Order ID: " + order.getId()));
        assertTrue(result.contains("Orderer: Customer A"));
        assertTrue(result.contains("Total Amount: 150.0"));
        assertTrue(result.contains("Delivery Address: 123 Main Street"));

        verify(orderRepo, times(1)).findDeliveredOrders();
    }

    @Test
    void testAssignSalesManagerRole_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesManagerService.assignSalesManagerRole(userId));
        verify(userRepo, times(1)).findById(userId);
        verifyNoInteractions(salesManagerRepo);
    }

    @Test
    void testAssignSalesManagerRole_Success() {
        UUID userId = UUID.randomUUID();
        User user = new User("Jane Doe", "jane@example.com", "password", "CUSTOMER");
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        salesManagerService.assignSalesManagerRole(userId);

        verify(userRepo, times(1)).findById(userId);
        verify(salesManagerRepo, times(1)).save(any(SalesManager.class));
    }
}