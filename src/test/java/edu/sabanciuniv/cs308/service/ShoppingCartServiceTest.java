package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ShoppingCartServiceTest {

    @InjectMocks
    private ShoppingCartService shoppingCartService;

    @Mock
    private ShoppingCartRepo shoppingCartRepo;

    @Mock
    private CartItemRepo cartItemRepo;

    @Mock
    private ProductRepo productRepo;

    @Mock
    private OrderRepo orderRepo;

    @Mock
    private UserRepo userRepo;

    private UUID userId;
    private UUID productId;
    private ShoppingCart shoppingCart;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        userId = UUID.randomUUID();
        productId = UUID.randomUUID();

        shoppingCart = new ShoppingCart();
        shoppingCart.setId(UUID.randomUUID());
        shoppingCart.setUserId(userId);
        shoppingCart.setCreatedAt(LocalDateTime.now());
        shoppingCart.setModifiedAt(LocalDateTime.now());
        shoppingCart.setOrdered(false);
        shoppingCart.setItems(new ArrayList<>());

        product = new Product();
        product.setId(productId);
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(100));
        product.setStockQuantity(10);

        cartItem = new CartItem(product, 2, shoppingCart);
        shoppingCart.getItems().add(cartItem);
    }

    @Test
    void testGetCartByUserId() {
        when(shoppingCartRepo.findByUserId(userId)).thenReturn(Optional.of(shoppingCart));

        Optional<ShoppingCart> result = shoppingCartService.getCartByUserId(userId);

        assertTrue(result.isPresent());
        assertEquals(shoppingCart, result.get());
        verify(shoppingCartRepo, times(1)).findByUserId(userId);
    }

    @Test
    void testCreateShoppingCartForUser() {
        when(shoppingCartRepo.findByUserId(userId)).thenReturn(Optional.empty());
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(shoppingCart);

        ShoppingCart result = shoppingCartService.createShoppingCartForUser(userId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(BigDecimal.ZERO, result.getTotal());
        verify(shoppingCartRepo, times(1)).findByUserId(userId);
        verify(shoppingCartRepo, times(1)).save(any(ShoppingCart.class));
    }

    @Test
    void testAddItemToCart() {
        // Arrange: Mock dependencies
        CartItem cartItem = new CartItem(product, 2, shoppingCart); // Start with quantity 2
        shoppingCart.setItems(List.of(cartItem)); // Mock the existing cart with 1 item (quantity 2)

        when(shoppingCartRepo.findByUserIdAndOrderedFalse(userId)).thenReturn(Optional.of(shoppingCart));
        when(productRepo.findById(productId)).thenReturn(Optional.of(product));
        when(cartItemRepo.findByShoppingCartAndProduct(shoppingCart, product)).thenReturn(Optional.of(cartItem)); // Return existing item
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(shoppingCart);

        // Act: Call method under test
        ShoppingCart result = shoppingCartService.addItemToCart(userId, productId, 1);

        // Assert: Verify the cart after adding item
        assertNotNull(result);
        assertEquals(1, result.getItems().size()); // Only 1 item (the added product) should be in the cart
        assertEquals(3, result.getItems().get(0).getQuantity()); // 2 initial + 1 added = 3
        verify(shoppingCartRepo, times(1)).findByUserIdAndOrderedFalse(userId);
        verify(productRepo, times(1)).findById(productId);
        verify(cartItemRepo, times(1)).findByShoppingCartAndProduct(shoppingCart, product);
        verify(shoppingCartRepo, times(1)).save(any(ShoppingCart.class));
    }

    @Test
    void testClearCart() {
        when(shoppingCartRepo.findByUserIdAndOrderedFalse(userId)).thenReturn(Optional.of(shoppingCart));

        shoppingCartService.clearCart(userId);

        assertTrue(shoppingCart.getItems().isEmpty());
        verify(cartItemRepo, times(1)).deleteAll(any());
        verify(shoppingCartRepo, times(1)).save(shoppingCart);
    }

    @Test
    void testConvertToOrder() {
        when(shoppingCartRepo.findByUserIdAndOrderedFalse(userId)).thenReturn(Optional.of(shoppingCart));
        when(userRepo.findById(userId)).thenReturn(Optional.of(new User("Test User", "test@example.com", "password")));
        when(orderRepo.save(any(Order.class))).thenReturn(new Order());

        Order result = shoppingCartService.convertToOrder(userId, "Credit Card", "John Doe", "123 Main St");

        assertNotNull(result);
        verify(orderRepo, times(1)).save(any(Order.class));
        verify(shoppingCartRepo, times(1)).save(shoppingCart);
    }
}
