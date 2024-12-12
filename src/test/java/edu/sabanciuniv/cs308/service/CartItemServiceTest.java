package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.repo.CartItemRepo;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class CartItemServiceTest {

    @InjectMocks
    private CartItemService cartItemService;

    @Mock
    private CartItemRepo cartItemRepo;

    @Mock
    private ShoppingCartRepo shoppingCartRepo;

    private UUID cartItemId;
    private CartItem cartItem;
    private ShoppingCart shoppingCart;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize mock data
        cartItemId = UUID.randomUUID();
        shoppingCart = new ShoppingCart();
        shoppingCart.setId(UUID.randomUUID());
        shoppingCart.setItems(new ArrayList<>()); // Initialize the items list

        cartItem = new CartItem();
        cartItem.setId(cartItemId);
        cartItem.setShoppingCart(shoppingCart);

        // Add cartItem to shoppingCart's items list
        shoppingCart.getItems().add(cartItem);
    }

    @Test
    void testDeleteCartItem_ItemExists_CartIsNotEmpty() {
        // Arrange: Mock dependencies
        when(cartItemRepo.existsById(cartItemId)).thenReturn(true);
        when(cartItemRepo.findById(cartItemId)).thenReturn(Optional.of(cartItem));

        // Act: Call the method under test
        cartItemService.deleteCartItem(cartItemId);

        // Assert: Verify that the CartItem is deleted and ShoppingCart is not deleted
        verify(cartItemRepo, times(1)).delete(cartItem);
        verify(shoppingCartRepo, times(0)).delete(shoppingCart);  // Cart should not be deleted
    }

    @Test
    void testDeleteCartItem_ItemExists_CartIsEmpty() {
        // Arrange: Simulate that the cart is empty after item deletion
        shoppingCart.getItems().clear(); // Remove all items from the cart
        when(cartItemRepo.existsById(cartItemId)).thenReturn(true);
        when(cartItemRepo.findById(cartItemId)).thenReturn(Optional.of(cartItem));

        // Act: Call the method under test
        cartItemService.deleteCartItem(cartItemId);

        // Assert: Verify that the CartItem is deleted and ShoppingCart is deleted because it's empty
        verify(cartItemRepo, times(1)).delete(cartItem);
        verify(shoppingCartRepo, times(1)).delete(shoppingCart);  // Cart should be deleted
    }

    @Test
    void testDeleteCartItem_ItemDoesNotExist() {
        // Arrange: Mock the scenario where CartItem doesn't exist
        when(cartItemRepo.existsById(cartItemId)).thenReturn(false);

        // Act & Assert: Call the method and expect a RuntimeException
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cartItemService.deleteCartItem(cartItemId);
        });

        assertEquals("CartItem not found with id: " + cartItemId, exception.getMessage());
        verify(cartItemRepo, times(0)).delete(any());  // Ensure delete is never called
        verify(shoppingCartRepo, times(0)).delete(any());  // Ensure delete is never called
    }
}
