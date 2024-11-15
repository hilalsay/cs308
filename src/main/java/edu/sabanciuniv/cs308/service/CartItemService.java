package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.repo.CartItemRepo;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepo cartItemRepository;

    @Autowired
    private ShoppingCartRepo shoppingCartRepository;

    public void deleteCartItem(UUID cartItemId) {
        // Check if CartItem exists
        if (cartItemRepository.existsById(cartItemId)) {
            CartItem cartItem = cartItemRepository.findById(cartItemId).orElse(null);

            if (cartItem != null) {
                // Optionally, perform any cleanup or validation logic
                // Example: Deleting the CartItem
                cartItemRepository.delete(cartItem);

                // You can also check if the ShoppingCart is empty and delete the cart if needed
                ShoppingCart cart = cartItem.getShoppingCart();
                if (cart != null && cart.getItems().isEmpty()) {
                    shoppingCartRepository.delete(cart);  // Delete the shopping cart if it has no items
                }
            }
        } else {
            // Handle the case where the CartItem doesn't exist
            throw new RuntimeException("CartItem not found with id: " + cartItemId);
        }
    }
}
