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
        Integer rating = 4;
        String comment = "Great product!";

        // Mocking order and shopping cart data
        Order order = new Order();
        order.setOrderStatus(OrderStatus.DELIVERED);
        ShoppingCart shoppingCart = mockShoppingCartWithProduct(productId);

        // Mock repository methods
        Mockito.when(orderRepoMock.findByUserId(userId)).thenReturn(Collections.singletonList(order));
        Mockito.when(shoppingCartRepoMock.findById(order.getShop_id())).thenReturn(Optional.of(shoppingCart));
        Mockito.when(reviewRepoMock.existsByProductIdAndUserId(productId, userId)).thenReturn(false);
        Mockito.when(reviewRepoMock.save(Mockito.any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call service and assert
        Review review = reviewService.addReview(productId, userId, rating, comment);
        assertReviewDetails(review, productId, userId, rating, comment);
    }

    @Test
    public void testAddReview_UserNotOrderedProduct() {
        UUID productId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        // Mock repository method
        Mockito.when(orderRepoMock.findByUserId(userId)).thenReturn(Collections.emptyList());

        // Assert exception is thrown
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.addReview(productId, userId, 4, "Great product!"));
        assertEquals("User has not purchased this product", exception.getMessage());
    }

    @Test
    public void testAddReview_UserAlreadyReviewedProduct() {
        UUID productId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

    // Mock order with DELIVERED status
        Order mockOrder = new Order();
        mockOrder.setOrderStatus(OrderStatus.DELIVERED);
        mockOrder.setShop_id(UUID.randomUUID());

    // Mock shopping cart with the product
        ShoppingCart mockCart = mockShoppingCartWithProduct(productId);

    // Mock repository methods
        Mockito.when(orderRepoMock.findByUserId(userId)).thenReturn(Collections.singletonList(mockOrder));
        Mockito.when(shoppingCartRepoMock.findById(mockOrder.getShop_id())).thenReturn(Optional.of(mockCart));
        Mockito.when(reviewRepoMock.existsByProductIdAndUserId(productId, userId)).thenReturn(true);

    // Assert exception is thrown
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.addReview(productId, userId, 4, "Great product!")
        );
        assertEquals("User has already reviewed this product", exception.getMessage());
    }


    @Test
    public void testUpdateReviewComment_Successful() {
        UUID reviewId = UUID.randomUUID();
        String newComment = "Updated comment!";

        // Mock review data
        Review review = new Review();
        review.setReviewId(reviewId);
        review.setComments("Old comment");
        Mockito.when(reviewRepoMock.findById(reviewId)).thenReturn(Optional.of(review));
        Mockito.when(reviewRepoMock.save(Mockito.any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call service and assert
        Review updatedReview = reviewService.updateReviewComment(reviewId, newComment);
        assertEquals(newComment, updatedReview.getComments());
    }

    @Test
    public void testUpdateReviewComment_ReviewNotFound() {
        UUID reviewId = UUID.randomUUID();
        String newComment = "Updated comment!";

        // Mock review not found
        Mockito.when(reviewRepoMock.findById(reviewId)).thenReturn(Optional.empty());

        // Assert exception is thrown
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.updateReviewComment(reviewId, newComment));
        assertEquals("Review not found", exception.getMessage());
    }

    @Test
    public void testGetAverageRatingByProductId() {
        UUID productId = UUID.randomUUID();
        List<Integer> ratings = Arrays.asList(5, 3, 4);

        // Mock review data
        Mockito.when(reviewRepoMock.findByProductId(productId)).thenReturn(createMockReviewsForProduct(productId, ratings));

        // Call service and assert
        double averageRating = reviewService.getAverageRatingByProductId(productId);
        assertEquals(4.0, averageRating, 0.01);
    }

    @Test
    public void testGetAverageRatingByProductId_NoReviews() {
        UUID productId = UUID.randomUUID();

        // Mock no reviews for product
        Mockito.when(reviewRepoMock.findByProductId(productId)).thenReturn(Collections.emptyList());

        // Assert exception is thrown
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                reviewService.getAverageRatingByProductId(productId));
        assertEquals("No ratings found for the specified product.", exception.getMessage());
    }

    // Helper method to create a ShoppingCart with a product
    private ShoppingCart mockShoppingCartWithProduct(UUID productId) {
        Product product = new Product();
        product.setId(productId);
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setItems(Collections.singletonList(new CartItem(product, 1, shoppingCart)));
        return shoppingCart;
    }

    // Helper method to assert review details
    private void assertReviewDetails(Review review, UUID productId, UUID userId, Integer rating, String comment) {
        assertNotNull(review);
        assertAll("Review Details",
                () -> assertEquals(productId, review.getProductId()),
                () -> assertEquals(userId, review.getUserId()),
                () -> assertEquals(rating, review.getRating()),
                () -> assertEquals(comment, review.getComments())
        );
    }

    // Helper method to create mock reviews for a product
    private List<Review> createMockReviewsForProduct(UUID productId, List<Integer> ratings) {
        List<Review> reviews = new ArrayList<>();
        for (Integer rating : ratings) {
            reviews.add(new Review(UUID.randomUUID(), productId, UUID.randomUUID(), rating, "Sample comment", null));
        }
        return reviews;
    }
}
