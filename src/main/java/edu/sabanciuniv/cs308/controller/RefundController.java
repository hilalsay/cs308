package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.RefundStatus;
import edu.sabanciuniv.cs308.model.RefundRequest;
import edu.sabanciuniv.cs308.service.OrderService;
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
    private OrderService orderService;

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
            @RequestParam UUID managerId) {
        try {
            RefundRequest approvedRefund = orderService.approveRefund(refundRequestId, managerId);
            return new ResponseEntity<>(approvedRefund, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error=" + e.getMessage());
        }
    }

    @PutMapping("/{refundRequestId}/reject")
    public ResponseEntity<?> rejectRefund(
            @PathVariable UUID refundRequestId,
            @RequestParam UUID managerId) {
        try {
            RefundRequest approvedRefund = orderService.rejectRefund(refundRequestId, managerId);
            return new ResponseEntity<>(approvedRefund, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error=" + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<RefundRequest>> getAllRefundRequests() {
        List<RefundRequest> refundRequests = orderService.viewRefundRequests();
        return new ResponseEntity<>(refundRequests, HttpStatus.OK);
    }
}

