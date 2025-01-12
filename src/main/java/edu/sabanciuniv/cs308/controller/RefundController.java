package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.RefundStatus;
import edu.sabanciuniv.cs308.model.RefundRequest;
import edu.sabanciuniv.cs308.repo.RefundRequestRepo;
import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.OrderService;
import edu.sabanciuniv.cs308.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtService jwtService;


    @Autowired
    private RefundRequestRepo refundRequestRepo;

    @PostMapping("/request")
    public ResponseEntity<?> requestRefund(
            @RequestParam UUID orderId,
            @RequestParam UUID productId) {
        try {
            RefundRequest refundRequest = orderService.requestRefund(orderId, productId);
            return new ResponseEntity<>(refundRequest, HttpStatus.CREATED);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Error:" + e.getMessage());
        }
    }

    @PutMapping("/{refundRequestId}/approve")
    public ResponseEntity<?> approveRefund(
            @PathVariable UUID refundRequestId,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7).trim();

            // Decode the token and get the current authenticated user's ID from the token
            String username = jwtService.extractUserName(jwt);
            UUID managerId = userService.getUserIdByUsername(username);
            RefundRequest approvedRefund = orderService.approveRefund(refundRequestId, managerId);
            return new ResponseEntity<>(approvedRefund, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error=" + e.getMessage());
        }
    }

    @PutMapping("/{refundRequestId}/reject")
    public ResponseEntity<?> rejectRefund(
            @PathVariable UUID refundRequestId,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7).trim();

            // Decode the token and get the current authenticated user's ID from the token
            String username = jwtService.extractUserName(jwt);
            UUID managerId = userService.getUserIdByUsername(username);
            RefundRequest approvedRefund = orderService.rejectRefund(refundRequestId, managerId);
            return new ResponseEntity<>(approvedRefund, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error=" + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RefundRequest>> getPendingRefundRequests() {
        List<RefundRequest> refundRequests = orderService.viewRefundRequests();
        return new ResponseEntity<>(refundRequests, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<RefundRequest>> getAllRefundRequests() {
        List<RefundRequest> refundRequests = orderService.viewAllRefundRequests();
        return new ResponseEntity<>(refundRequests, HttpStatus.OK);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getRefundStatus(
            @RequestParam UUID orderId,
            @RequestParam UUID productId) {
        try {
            // Fetch refund requests that match the criteria
            List<RefundRequest> refundRequests = orderService.viewTheRefundRequests(orderId, productId);

            // Check if the list is empty
            if (refundRequests.isEmpty()) {
                return ResponseEntity.ok("NONE");
            }

            // Return the status of the single request
            return ResponseEntity.ok(refundRequests.get(0).getStatus());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}

