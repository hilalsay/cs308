package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    // Checkout endpoint to place an order
    @PostMapping("/checkout/{userId}")
    public String checkout(@PathVariable User userId, @RequestParam String paymentMethod) {
        return shoppingCartService.checkout(userId, paymentMethod);
    }
}
