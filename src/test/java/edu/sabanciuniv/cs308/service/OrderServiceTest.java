package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderServiceTest {

    @Mock
    private OrderRepo orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Prepare a sample order
        User user = new User();
        user.setId(UUID.randomUUID());

        order = new Order();
        order.setId(UUID.randomUUID());
        order.setUser(user);
        order.setShop_id(UUID.randomUUID());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.valueOf(150.75));
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPaymentDate(LocalDateTime.now());
        order.setPaymentMethod("Credit Card");
    }

    @Test
    public void testFindAll() {
        // Arrange
        when(orderRepository.findAll()).thenReturn(List.of(order));

        // Act
        List<Order> orders = orderService.findAll();

        // Assert
        assertNotNull(orders);
        assertFalse(orders.isEmpty());
        assertEquals(1, orders.size());
        assertEquals(order.getId(), orders.get(0).getId());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    public void testFindById() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        Optional<Order> foundOrder = orderService.findById(order.getId());

        // Assert
        assertTrue(foundOrder.isPresent());
        assertEquals(order.getId(), foundOrder.get().getId());
        verify(orderRepository, times(1)).findById(order.getId());
    }

    @Test
    public void testFindById_NotFound() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act
        Optional<Order> foundOrder = orderService.findById(order.getId());

        // Assert
        assertTrue(foundOrder.isEmpty());
        verify(orderRepository, times(1)).findById(order.getId());
    }

    @Test
    public void testDeleteById_WhenExists() {
        // Arrange
        when(orderRepository.existsById(order.getId())).thenReturn(true);

        // Act
        boolean result = orderService.deleteById(order.getId());

        // Assert
        assertTrue(result);
        verify(orderRepository, times(1)).deleteById(order.getId());
    }

    @Test
    public void testDeleteById_WhenNotExists() {
        // Arrange
        when(orderRepository.existsById(order.getId())).thenReturn(false);

        // Act
        boolean result = orderService.deleteById(order.getId());

        // Assert
        assertFalse(result);
        verify(orderRepository, times(0)).deleteById(order.getId());
    }

    @Test
    public void testUpdateOrderStatus() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        OrderStatus newStatus = OrderStatus.DELIVERED;
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Order updatedOrder = orderService.updateOrderStatus(order.getId(), newStatus);

        // Assert
        assertEquals(newStatus, updatedOrder.getOrderStatus());
        verify(orderRepository, times(1)).save(updatedOrder);
    }

    @Test
    public void testUpdateOrderStatus_WhenOrderNotFound() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(order.getId(), OrderStatus.DELIVERED));
    }

    @Test
    public void testSimulateDelivery() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Order deliveredOrder = orderService.simulateDelivery(order.getId());

        // Assert
        assertEquals(OrderStatus.DELIVERED, deliveredOrder.getOrderStatus());
        verify(orderRepository, times(1)).save(deliveredOrder);
    }

    @Test
    public void testSimulateDelivery_WhenOrderNotFound() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.simulateDelivery(order.getId()));
    }

    @Test
    public void testCreateOrder() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        Order createdOrder = orderService.createOrder(order);

        // Assert
        assertNotNull(createdOrder);
        assertEquals(order.getId(), createdOrder.getId());
        assertEquals(order.getUser(), createdOrder.getUser());
        assertEquals(order.getTotalAmount(), createdOrder.getTotalAmount());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testFromString() {
        assertEquals(OrderStatus.PENDING, OrderStatus.fromString("pending"));
        assertEquals(OrderStatus.PROCESSING, OrderStatus.fromString("PROCESSING"));
        assertEquals(OrderStatus.IN_TRANSIT, OrderStatus.fromString("in_transit"));
        assertEquals(OrderStatus.DELIVERED, OrderStatus.fromString("DELIVERED"));
        assertEquals(OrderStatus.CANCELED, OrderStatus.fromString("canceled"));

        // Geçersiz durumlar
        assertThrows(IllegalArgumentException.class, () -> OrderStatus.fromString("invalid_status"));
        assertThrows(IllegalArgumentException.class, () -> OrderStatus.fromString(null));
    }

}
