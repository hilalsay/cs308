package edu.sabanciuniv.cs308.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class Revenue {

    private LocalDate date;  // Changed date to LocalDate type for easier date manipulation
    private BigDecimal totalRevenue;  // Changed totalRevenue to BigDecimal for better precision in financial calculations

    public Revenue() {
    }

    public Revenue(LocalDate date, BigDecimal totalRevenue) {
        this.date = date;
        this.totalRevenue = totalRevenue;
    }

    public Revenue(String string, int i) {
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    /**
     * Calculates the total revenue for a specific date from a list of orders.
     *
     * @param orders List of all orders.
     */
    public void calculateRevenueForDate(List<Order> orders) {
        // Filter orders by date and sum up the total revenue for the specified date
        this.totalRevenue = orders.stream()
                .filter(order -> order.getCreatedAt().toLocalDate().equals(this.date)) // Filter orders by matching date
                .map(order -> order.getTotalAmount()) // Map each order to its totalAmount
                .reduce(BigDecimal.ZERO, BigDecimal::add);  // Sum the total amounts of the orders
    }

    @Override
    public String toString() {
        return "Revenue{" +
                "date=" + date +
                ", totalRevenue=" + totalRevenue +
                '}';
    }
}
