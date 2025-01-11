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

    @GetMapping("/total")
    public Revenue getTotalRevenueByDate(@RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        return revenueService.calculateTotalRevenueByDate(localDate);
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
