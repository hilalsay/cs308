package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.model.OrderStatus;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import edu.sabanciuniv.cs308.repo.ReviewRepo;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Service
public class ReviewService {

    private final ReviewRepo reviewRepository;
    private final OrderRepo orderRepository;
    private final ShoppingCartRepo shoppingCartRepository;

    public ReviewService(ReviewRepo reviewRepository, OrderRepo orderRepository, ShoppingCartRepo shoppingCartRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.shoppingCartRepository = shoppingCartRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByProductId(UUID productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review addReview(UUID productId, UUID userId, Integer rating, String comments) {
        // Check if the user has ordered this product
        boolean hasOrderedProduct = hasUserOrderedProduct(userId, productId);
        if (!hasOrderedProduct) {
            throw new IllegalArgumentException("User has not purchased this product");
        }

        // Check if the user has already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("User has already reviewed this product");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Create and save the review
        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setRating(rating);
        review.setComments(comments);
        return reviewRepository.save(review);
    }

    private boolean hasUserOrderedProduct(UUID userId, UUID productId) {
        // Fetch all orders by the user
        List<Order> userOrders = orderRepository.findByUserId(userId);

        for (Order order : userOrders) {
            if (order.getOrderStatus().equals(OrderStatus.DELIVERED)) { // Ensure the product was delivered
                ShoppingCart shoppingCart = shoppingCartRepository.findById(order.getShop_id()).orElse(null);
                if (shoppingCart != null) {
                    return shoppingCart.getItems().stream()
                            .anyMatch(item -> item.getProduct().getId().equals(productId));
                }
            }
        }
        return false;
    }

    // Fetch all ratings for a product
    public List<Integer> getRatingsByProductId(UUID productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(Review::getRating)
                .toList();
    }

    // Fetch all reviews by a user
    public List<Review> getReviewsByUserId(UUID userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Delete a review by its ID
    public void deleteReview(UUID reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    // Delete only the comment of a review
    public void deleteComment(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setComments(null);
        reviewRepository.save(review);
    }

    // Delete only the rating of a review
    public void deleteRating(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setRating(null);
        reviewRepository.save(review);
    }

}