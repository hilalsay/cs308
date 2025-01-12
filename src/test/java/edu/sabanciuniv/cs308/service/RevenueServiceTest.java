package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.Revenue;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RevenueServiceTest {

    @InjectMocks
    private RevenueService revenueService;

    @Mock
    private OrderRepo orderRepo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCalculateTotalRevenueByDate_NoOrders() {
        LocalDate date = LocalDate.of(2025, 1, 1);

        when(orderRepo.findByCreatedAtBetween(date.atStartOfDay(), date.atTime(23, 59, 59)))
                .thenReturn(Collections.emptyList());

        Revenue revenue = revenueService.calculateTotalRevenueByDate(date);

        assertNotNull(revenue);
        assertEquals(date, revenue.getDate());
        assertEquals(BigDecimal.ZERO, revenue.getTotalRevenue());
        verify(orderRepo, times(1)).findByCreatedAtBetween(any(), any());
    }

    @Test
    void testCalculateTotalRevenueByDate_WithOrders() {
        LocalDate date = LocalDate.of(2025, 1, 1);
        List<Order> orders = Arrays.asList(
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(100), LocalDateTime.of(2025, 1, 1, 10, 0), LocalDateTime.now(), null, null, "John Doe", "123 Main St"),
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(200), LocalDateTime.of(2025, 1, 1, 14, 0), LocalDateTime.now(), null, null, "Jane Smith", "456 Elm St")
        );

        when(orderRepo.findByCreatedAtBetween(date.atStartOfDay(), date.atTime(23, 59, 59)))
                .thenReturn(orders);

        Revenue revenue = revenueService.calculateTotalRevenueByDate(date);

        assertNotNull(revenue);
        assertEquals(date, revenue.getDate());
        assertEquals(BigDecimal.valueOf(300), revenue.getTotalRevenue());
        verify(orderRepo, times(1)).findByCreatedAtBetween(any(), any());
    }

    @Test
    void testCalculateTotalRevenueForDateRange_NoOrders() {
        LocalDate startDate = LocalDate.of(2025, 1, 1);
        LocalDate endDate = LocalDate.of(2025, 1, 7);

        when(orderRepo.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)))
                .thenReturn(Collections.emptyList());

        List<Revenue> revenues = revenueService.calculateTotalRevenueForDateRange(startDate, endDate);

        assertNotNull(revenues);
        assertTrue(revenues.isEmpty());
        verify(orderRepo, times(1)).findByCreatedAtBetween(any(), any());
    }

    @Test
    void testCalculateTotalRevenueForDateRange_WithOrders() {
        LocalDate startDate = LocalDate.of(2025, 1, 1);
        LocalDate endDate = LocalDate.of(2025, 1, 3);
        List<Order> orders = Arrays.asList(
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(100), LocalDateTime.of(2025, 1, 1, 10, 0), LocalDateTime.now(), null, null, "John Doe", "123 Main St"),
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(200), LocalDateTime.of(2025, 1, 2, 14, 0), LocalDateTime.now(), null, null, "Jane Smith", "456 Elm St"),
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(150), LocalDateTime.of(2025, 1, 3, 16, 0), LocalDateTime.now(), null, null, "Alice Brown", "789 Oak St")
        );

        when(orderRepo.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)))
                .thenReturn(orders);

        List<Revenue> revenues = revenueService.calculateTotalRevenueForDateRange(startDate, endDate);

        assertNotNull(revenues);
        assertEquals(3, revenues.size());
        assertEquals(BigDecimal.valueOf(100), revenues.get(2).getTotalRevenue());
        assertEquals(BigDecimal.valueOf(200), revenues.get(1).getTotalRevenue());
        assertEquals(BigDecimal.valueOf(150), revenues.get(0).getTotalRevenue());
        verify(orderRepo, times(1)).findByCreatedAtBetween(any(), any());
    }

    @Test
    void testGetTotalRevenueByDate_NoOrders() {
        LocalDate date = LocalDate.of(2025, 1, 1);

        when(orderRepo.findByCreatedAtBetween(date.atStartOfDay(), date.atTime(23, 59, 59)))
                .thenReturn(Collections.emptyList());

        String jsonResult = revenueService.getTotalRevenueByDate(date);

        assertNotNull(jsonResult);
        assertEquals(String.format("{\"date\": \"%s\", \"totalRevenue\": 0,00}", date), jsonResult);
        verify(orderRepo, times(1)).findByCreatedAtBetween(any(), any());
    }

    @Test
    void testCalculateTotalRevenueForAllDays_WithOrders() {
        List<Order> orders = Arrays.asList(
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(100), LocalDateTime.of(2025, 1, 1, 10, 0), LocalDateTime.now(), null, null, "John Doe", "123 Main St"),
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(200), LocalDateTime.of(2025, 1, 2, 14, 0), LocalDateTime.now(), null, null, "Jane Smith", "456 Elm St"),
                new Order(UUID.randomUUID(), null, UUID.randomUUID(), null, BigDecimal.valueOf(150), LocalDateTime.of(2025, 1, 1, 16, 0), LocalDateTime.now(), null, null, "Alice Brown", "789 Oak St")
        );

        when(orderRepo.findAll()).thenReturn(orders);

        List<Map<String, Object>> revenues = revenueService.calculateTotalRevenueForAllDays();

        assertNotNull(revenues);
        assertEquals(2, revenues.size());
        assertEquals("2025-01-01", revenues.get(1).get("date"));
        assertEquals(BigDecimal.valueOf(250), revenues.get(1).get("totalRevenue"));
        assertEquals("2025-01-02", revenues.get(0).get("date"));
        assertEquals(BigDecimal.valueOf(200), revenues.get(0).get("totalRevenue"));
        verify(orderRepo, times(1)).findAll();
    }
}
