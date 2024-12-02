package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import edu.sabanciuniv.cs308.repo.ReviewRepo;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class ReviewServiceTest {

    private ReviewService reviewService;
    private ReviewRepo reviewRepoMock;
    private OrderRepo orderRepoMock;
    private ShoppingCartRepo shoppingCartRepoMock;
    private ProductRepo productRepoMock;

    @BeforeEach
    public void setUp() {
        reviewRepoMock = Mockito.mock(ReviewRepo.class);
        orderRepoMock = Mockito.mock(OrderRepo.class);
        shoppingCartRepoMock = Mockito.mock(ShoppingCartRepo.class);
        productRepoMock = Mockito.mock(ProductRepo.class);
        reviewService = new ReviewService(reviewRepoMock, orderRepoMock, shoppingCartRepoMock, productRepoMock);
    }

    @Test
    public void testAddReview_Successful() {
        UUID productId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        Integer rating = 4;
        String comment = "Great product!";

        // Mock dependencies
        Order order = createMockOrder(orderId, OrderStatus.DELIVERED, productId);
        Mockito.when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(order));
        Mockito.when(reviewRepoMock.existsByProductIdAndUserId(productId, userId)).thenReturn(false);
        Mockito.when(reviewRepoMock.save(Mockito.any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call service and assert
        Review review = reviewService.addReview(productId, orderId, userId, rating, comment);
        assertNotNull(review);
        assertEquals(productId, review.getProductId());
        assertEquals(userId, review.getUserId());
        assertEquals(rating, review.getRating());
        assertEquals(comment, review.getComments());
    }

    @Test
    public void testAddReview_OrderNotDelivered() {
        UUID productId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();

        // Mock dependencies
        Order order = createMockOrder(orderId, OrderStatus.PENDING, productId);
        Mockito.when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(order));

        // Assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.addReview(productId, orderId, userId, 4, "Great product!"));
        assertEquals("User has not purchased this product or order is not delivered", exception.getMessage());
    }

    @Test
    public void testAddReview_UserAlreadyReviewed() {
        UUID productId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();

        // Mock dependencies
        Order order = createMockOrder(orderId, OrderStatus.DELIVERED, productId);
        Mockito.when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(order));
        Mockito.when(reviewRepoMock.existsByProductIdAndUserId(productId, userId)).thenReturn(true);

        // Assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.addReview(productId, orderId, userId, 4, "Great product!"));
        assertEquals("User has already reviewed this product", exception.getMessage());
    }

    @Test
    public void testUpdateReviewComment_Successful() {
        UUID reviewId = UUID.randomUUID();
        String newComment = "Updated comment!";

        // Mock dependencies
        Review review = createMockReview(reviewId, "Old comment", null);
        Mockito.when(reviewRepoMock.findById(reviewId)).thenReturn(Optional.of(review));
        Mockito.when(reviewRepoMock.save(Mockito.any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call service and assert
        Review updatedReview = reviewService.updateReviewComment(reviewId, newComment);
        assertNotNull(updatedReview);
        assertEquals(newComment, updatedReview.getComments());
    }

    @Test
    public void testUpdateReviewComment_ReviewNotFound() {
        UUID reviewId = UUID.randomUUID();

        // Mock dependencies
        Mockito.when(reviewRepoMock.findById(reviewId)).thenReturn(Optional.empty());

        // Assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.updateReviewComment(reviewId, "Updated comment!"));
        assertEquals("Review not found", exception.getMessage());
    }

    @Test
    public void testGetAverageRatingByProductId_Successful() {
        UUID productId = UUID.randomUUID();
        List<Integer> ratings = Arrays.asList(5, 4, 3);

        // Mock dependencies
        Mockito.when(reviewRepoMock.findByProductId(productId))
                .thenReturn(createMockReviewsForProduct(productId, ratings));

        // Call service and assert
        double averageRating = reviewService.getAverageRatingByProductId(productId);
        assertEquals(4.0, averageRating, 0.01);
    }

    @Test
    public void testGetAverageRatingByProductId_NoRatings() {
        UUID productId = UUID.randomUUID();

        // Mock dependencies
        Mockito.when(reviewRepoMock.findByProductId(productId)).thenReturn(Collections.emptyList());

        // Assert exception
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.getAverageRatingByProductId(productId));
        assertEquals("No ratings found for the specified product.", exception.getMessage());
    }

    // Helper methods
    private Order createMockOrder(UUID orderId, OrderStatus status, UUID productId) {
        Order order = new Order();
        order.setId(orderId);
        order.setOrderStatus(status);
        ShoppingCart shoppingCart = mockShoppingCartWithProduct(productId);
        order.setShop_id(shoppingCart.getId());
        return order;
    }

    private ShoppingCart mockShoppingCartWithProduct(UUID productId) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setId(UUID.randomUUID());
        Product product = new Product();
        product.setId(productId);
        CartItem item = new CartItem();
        item.setProduct(product);
        shoppingCart.setItems(Collections.singletonList(item));
        return shoppingCart;
    }

    private Review createMockReview(UUID reviewId, String comments, Integer rating) {
        Review review = new Review();
        review.setReviewId(reviewId);
        review.setComments(comments);
        review.setRating(rating);
        return review;
    }

    private List<Review> createMockReviewsForProduct(UUID productId, List<Integer> ratings) {
        List<Review> reviews = new ArrayList<>();
        for (Integer rating : ratings) {
            Review review = new Review();
            review.setProductId(productId);
            review.setRating(rating);
            reviews.add(review);
        }
        return reviews;
    }
}
