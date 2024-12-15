package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.service.SalesManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sales-managers")
public class SalesManagerController {

    @Autowired
    private SalesManagerService salesManagerService;

    // Endpoint to assign sales manager role
    @PutMapping("/assign/{userId}")
    public ResponseEntity<String> assignSalesManagerRole(@PathVariable UUID userId) {
        salesManagerService.assignSalesManagerRole(userId);
        return new ResponseEntity<>("Sales Manager role assigned successfully.", HttpStatus.OK);
    }
}
