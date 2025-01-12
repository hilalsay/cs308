package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.Wishlist;
import edu.sabanciuniv.cs308.repo.WishlistRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WishlistServiceTest {

    @Mock
    private WishlistRepo wishlistRepository;

    @Mock
    private ProductService productService;

    @Mock
    private UserService userService;

    @InjectMocks
    private WishlistService wishlistService;

    private UUID userId;
    private UUID productId;
    private User user;
    private Product product;
    private Wishlist wishlist;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        userId = UUID.randomUUID();
        productId = UUID.randomUUID();

        user = new User();
        user.setId(userId);

        product = new Product();
        product.setId(productId);

        wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProducts(new HashSet<>());

    }

    @Test
    void testGetWishlistByUserId() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        Wishlist result = wishlistService.getWishlistByUserId(userId);

        assertNotNull(result);
        assertEquals(wishlist, result);
        verify(wishlistRepository, times(1)).findByUser(user);
    }

    @Test
    void testGetWishlistByUserIdNotFound() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.empty());

        Wishlist result = wishlistService.getWishlistByUserId(userId);

        assertNull(result);
        verify(wishlistRepository, times(1)).findByUser(user);
    }

    @Test
    void testAddProductToWishlist() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(productService.getProductById(productId)).thenReturn(product);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));
        when(wishlistRepository.save(any(Wishlist.class))).thenReturn(wishlist);

        Wishlist result = wishlistService.addProductToWishlist(userId, productId);

        assertNotNull(result);
        assertTrue(result.getProducts().contains(product));
        verify(wishlistRepository, times(1)).save(wishlist);
    }

    @Test
    void testAddProductToNewWishlist() {
        // Mock user and product retrieval
        when(userService.getUserById(userId)).thenReturn(user);
        when(productService.getProductById(productId)).thenReturn(product);

        // Simulate no existing wishlist
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.empty());

        // Mock saving the wishlist
        when(wishlistRepository.save(any(Wishlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call the method
        Wishlist result = wishlistService.addProductToWishlist(userId, productId);

        // Assertions
        assertNotNull(result);
        assertTrue(result.getProducts().contains(product), "The product should be in the wishlist.");
    }


    @Test
    void testAddProductToWishlistProductNotFound() {
        when(productService.getProductById(productId)).thenReturn(null);

        Exception exception = assertThrows(RuntimeException.class, () ->
                wishlistService.addProductToWishlist(userId, productId));

        assertEquals("Product not found", exception.getMessage());
    }

    @Test
    void testRemoveProductFromWishlist() {
        wishlist.getProducts().add(product);
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));
        when(wishlistRepository.save(any(Wishlist.class))).thenReturn(wishlist);

        Wishlist result = wishlistService.removeProductFromWishlist(userId, productId);

        assertNotNull(result);
        assertFalse(result.getProducts().contains(product));
        verify(wishlistRepository, times(1)).save(wishlist);
    }

    @Test
    void testRemoveProductFromWishlistNotFound() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () ->
                wishlistService.removeProductFromWishlist(userId, productId));

        assertEquals("Wishlist not found", exception.getMessage());
    }

    @Test
    void testClearWishlist() {
        wishlist.getProducts().add(product);
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        wishlistService.clearWishlist(userId);

        assertTrue(wishlist.getProducts().isEmpty());
        verify(wishlistRepository, times(1)).save(wishlist);
    }

    @Test
    void testConfirmOrderFromWishlist() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        Wishlist result = wishlistService.confirmOrderFromWishlist(userId, "Credit Card", "John Doe", "123 Main St");

        assertNotNull(result);
        assertEquals(wishlist, result);
    }

    @Test
    void testConfirmOrderFromWishlistNotFound() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () ->
                wishlistService.confirmOrderFromWishlist(userId, "Credit Card", "John Doe", "123 Main St"));

        assertEquals("Wishlist not found", exception.getMessage());
    }

    @Test
    void testGetProductInfoFromWishlist() {
        wishlist.getProducts().add(product);
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        Product result = wishlistService.getProductInfoFromWishlist(userId, productId);

        assertNotNull(result);
        assertEquals(product, result);
    }

    @Test
    void testGetProductInfoFromWishlistProductNotFound() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        Product result = wishlistService.getProductInfoFromWishlist(userId, productId);

        assertNull(result);
    }

    @Test
    void testGetAllProductsInWishlist() {
        wishlist.getProducts().add(product);
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        List<Product> result = wishlistService.getAllProductsInWishlist(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.contains(product));
    }

    @Test
    void testGetAllProductsInWishlistEmpty() {
        when(userService.getUserById(userId)).thenReturn(user);
        when(wishlistRepository.findByUser(user)).thenReturn(Optional.of(wishlist));

        List<Product> result = wishlistService.getAllProductsInWishlist(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
