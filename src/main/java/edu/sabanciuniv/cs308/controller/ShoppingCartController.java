package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    // Endpoint to view the user's shopping cart by user ID
    @GetMapping("/view/{userId}")
    public Optional<ShoppingCart> viewCart(@PathVariable Long userId) {
        return shoppingCartService.getCartByUserId(userId);
    }

//    // Endpoint to add an item to the cart (details of the item would be provided in the request body)
//    @PostMapping("/add/{userId}")
//    public String addItemToCart(@PathVariable Long userId, @RequestBody CartItemDto itemDto) {
//        return shoppingCartService.addItemToCart(userId, itemDto);
//    }
//
//    // Endpoint to update item quantity in the cart
//    @PutMapping("/update/{userId}")
//    public String updateItemQuantity(@PathVariable Long userId, @RequestBody CartItemDto itemDto) {
//        return shoppingCartService.updateItemQuantity(userId, itemDto);
//    }
//
//    // Endpoint to checkout and complete the order
//    @PostMapping("/checkout/{userId}")
//    public String checkout(@PathVariable Long userId) {
//        return shoppingCartService.checkout(userId);
//    }
}
