package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.Revenue;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RevenueService {

    @Autowired
    private OrderRepo orderRepo;

    /**
     * Calculates the total revenue for a specific date.
     *
     * @param date The date for which revenue needs to be calculated.
     * @return Revenue object containing the date and total revenue.
     */
    public Revenue calculateTotalRevenueByDate(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }

        // Fetch orders for the given date
        List<Order> orders = orderRepo.findByCreatedAtBetween(date.atStartOfDay(), date.atTime(23, 59, 59));

        // If there are no orders on that date, set revenue to 0
        if (orders.isEmpty()) {
            return new Revenue(LocalDate.parse(date.toString()), BigDecimal.ZERO);
        }

        // Create Revenue object and calculate revenue for the specific date
        Revenue revenue = new Revenue(LocalDate.parse(date.toString()), BigDecimal.ZERO);
        revenue.calculateRevenueForDate(orders);

        return revenue;
    }

    /**
     * Calculates the total revenue for a date range.
     *
     * @param startDate The start date.
     * @param endDate   The end date.
     * @return List of Revenue objects for each date in the range.
     */
    public List<Revenue> calculateTotalRevenueForDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }

        // Fetch orders within the date range
        List<Order> orders = orderRepo.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        // If there are no orders in the given date range, return an empty list
        if (orders.isEmpty()) {
            return List.of(); // return empty list if no orders found
        }

        // Group orders by date and calculate revenue for each date
        return orders.stream()
                .collect(Collectors.groupingBy(order -> order.getCreatedAt().toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    Revenue revenue = new Revenue(LocalDate.parse(entry.getKey().toString()), BigDecimal.ZERO);
                    revenue.calculateRevenueForDate(entry.getValue());
                    return revenue;
                })
                .collect(Collectors.toList());
    }

    /**
     * Returns the total revenue for a specific date in JSON-like format.
     *
     * @param date The date for which the revenue is calculated.
     * @return A string containing the date and total revenue formatted as JSON.
     */
    public String getTotalRevenueByDate(LocalDate date) {
        if (date == null) {
            return "{\"error\": \"Date cannot be null\"}";
        }

        // Fetch orders created on the specified date using findByCreatedAtBetween
        List<Order> orders = orderRepo.findByCreatedAtBetween(
                date.atStartOfDay(), date.atTime(23, 59, 59));

        BigDecimal totalRevenue = BigDecimal.ZERO;

        // If no orders found, set revenue to 0
        if (orders.isEmpty()) {
            return String.format("{\"date\": \"%s\", \"totalRevenue\": %.2f}",
                    date.format(DateTimeFormatter.ISO_LOCAL_DATE), totalRevenue.doubleValue());
        }

        // Calculate total revenue by summing the totalAmount of each order
        for (Order order : orders) {
            totalRevenue = totalRevenue.add(order.getTotalAmount());
        }

        // Return the total revenue in the required JSON format
        return String.format("{\"date\": \"%s\", \"totalRevenue\": %.2f}",
                date.format(DateTimeFormatter.ISO_LOCAL_DATE), totalRevenue.doubleValue());
    }

    /**
     * Calculates the total revenue for all orders.
     *
     * @return Total revenue for all orders as a BigDecimal.
     */
    public List<Map<String, Object>> calculateTotalRevenueForAllDays() {
        List<Order> orders = orderRepo.findAll();

        // Her gün için toplam gelirleri hesapla
        Map<LocalDate, BigDecimal> revenueMap = orders.stream()
                .filter(order -> order.getCreatedAt() != null) // Null createdAt'ları filtrele
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate(), // OrderDate kullanarak gruplama yap
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add) // Her grup için toplam geliri hesapla
                ));

        // Map'i istediğiniz formata dönüştür
        return revenueMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("date", entry.getKey().toString()); // LocalDate'yi string formatına çevir
                    result.put("totalRevenue", entry.getValue()); // Toplam gelir
                    return result;
                })
                .collect(Collectors.toList());
    }
}
