package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
//import edu.sabanciuniv.cs308.dto.CartItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    // Retrieves the shopping cart by user ID
    public Optional<ShoppingCart> getCartByUserId(UUID userId) {
        return shoppingCartRepo.findByUserId(userId);
    }

//    // Adds an item to the shopping cart
//    public String addItemToCart(Long userId, CartItemDto itemDto) {
//        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findByUserId(userId);
//
//        // If the user has an existing cart, update it; otherwise, create a new one
//        ShoppingCart cart = cartOpt.orElseGet(() -> new ShoppingCart(userId));
//
//        cart.addItem(itemDto.getProductId(), itemDto.getQuantity());  // This method should handle adding or updating item quantity
//
//        shoppingCartRepo.save(cart);
//        return "Item added to cart.";
//    }
//
//    // Updates the quantity of an item in the cart
//    public String updateItemQuantity(Long userId, CartItemDto itemDto) {
//        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findByUserId(userId);
//
//        if (cartOpt.isEmpty()) {
//            return "Cart not found for user.";
//        }
//
//        ShoppingCart cart = cartOpt.get();
//        boolean updated = cart.updateItemQuantity(itemDto.getProductId(), itemDto.getQuantity());
//
//        if (updated) {
//            shoppingCartRepo.save(cart);
//            return "Item quantity updated.";
//        } else {
//            return "Item not found in cart.";
//        }
//    }
//
//    // Handles the checkout process for the cart
//    public String checkout(Long userId) {
//        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findByUserId(userId);
//
//        if (cartOpt.isEmpty()) {
//            return "Cart not found for user.";
//        }
//
//        ShoppingCart cart = cartOpt.get();
//
//        if (cart.getItems().isEmpty()) {
//            return "Cart is empty.";
//        }
//
//        // Implement additional checkout logic here, like updating stock quantities and processing payment
//
//        shoppingCartRepo.delete(cart);  // Clear the cart after checkout
//        return "Checkout completed successfully.";
//    }
}
