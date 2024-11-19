package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class OrderServiceTest {

    @Mock
    private OrderRepo orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;

    @BeforeEach
    public void setUp() {
        // Set up a mock order object for tests
        order = new Order();
        order.setId(UUID.randomUUID());
        order.setOrderStatus(OrderStatus.PENDING);
    }

    @Test
    public void testFindAll() {
        // Arrange
        when(orderRepository.findAll()).thenReturn(List.of(order));

        // Act
        var orders = orderService.findAll();

        // Assert
        assertNotNull(orders);
        assertFalse(orders.isEmpty());
        assertEquals(1, orders.size());
    }

    @Test
    public void testFindById() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        // Act
        var foundOrder = orderService.findById(order.getId());

        // Assert
        assertTrue(foundOrder.isPresent());
        assertEquals(order.getId(), foundOrder.get().getId());
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
    public void testUpdateOrderStatus_WhenOrderNotFound() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(order.getId(), OrderStatus.DELIVERED));
    }

    @Test
    public void testSimulateDelivery_WhenOrderNotFound() {
        // Arrange
        when(orderRepository.findById(order.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.simulateDelivery(order.getId()));
    }
}
