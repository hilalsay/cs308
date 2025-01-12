package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Revenue;
import edu.sabanciuniv.cs308.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    /**
     * Endpoint to get total revenue for a specific date or all days.
     *
     * @param date The date for which revenue is calculated (optional).
     * @return The total revenue for the specified date or for all days.
     */
    @GetMapping("/total")
    public Object getTotalRevenueByDate(@RequestParam(value = "date", required = false) String date) {
        if (date != null) {
            // If a date parameter is provided, calculate revenue for that specific date.
            LocalDate localDate = LocalDate.parse(date);
            return revenueService.calculateTotalRevenueByDate(localDate);
        } else {
            // If no date parameter is provided, calculate revenue for all days.
            return revenueService.calculateTotalRevenueForAllDays();
        }
    }

    /**
     * Endpoint to get total revenue for a range of dates.
     *
     * @param startDate The start date of the range.
     * @param endDate   The end date of the range.
     * @return List of Revenue objects for each date in the range.
     */
    @GetMapping("/total/range")
    public List<Revenue> getTotalRevenueForDateRange(@RequestParam("startDate") String startDate,
                                                     @RequestParam("endDate") String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return revenueService.calculateTotalRevenueForDateRange(start, end);
    }
}
