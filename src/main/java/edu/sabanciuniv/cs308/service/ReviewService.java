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

    // Approve a review
    public Review approveComment(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getApprovedReviewsByProduct(UUID productId) {
        return reviewRepository.findByProductIdAndApproved(productId, true);
    }


    public List<String> getApprovedCommentsByProduct(UUID productId) {
        return reviewRepository.findByProductIdAndApproved(productId, true)
                .stream()
                .map(Review::getComments)
                .filter(comment -> comment != null && !comment.isEmpty())
                .toList();
    }

    // Fetch all ratings for a product
    public List<Integer> getRatingsByProduct(UUID productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(Review::getRating)
                .toList();
    }

    // Fetch reviews by a specific user
    public List<Review> getReviewsByUserId(UUID userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Review addReview(UUID productId, UUID orderId,  UUID userId, Integer rating, String comments) {
        // Check if the user has ordered this product
        // Fetch the order using the orderId
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }

        Order order = orderOpt.get();

        // Check if the order status is DELIVERED
        if (!order.getOrderStatus().equals(OrderStatus.DELIVERED)) {
            throw new IllegalArgumentException("User has not purchased this product or order is not delivered");
        }

        // Check if the user has already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("User has already reviewed this product");
        }

        // If no rating provided, set it to null
        if (rating == null) {
            rating = null;
        }

        // Validate rating if provided
        else if (rating < 1 || rating > 5){
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Create and save the review
        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setRating(rating);  // rating can be null
        review.setComments(comments);  // comments can be null
        review.setApproved(true); // Default approval status --> CHANGE IT FALSE BEFORE DEMO
        return reviewRepository.save(review);
    }

    private boolean hasUserOrderedProduct(UUID userId, UUID productId, UUID orderId) {
        // Fetch all orders by the user
        List<Order> userOrders = orderRepository.findByUserId(userId);

        for (Order order : userOrders) {
            if (order.getOrderStatus().equals(OrderStatus.DELIVERED)) { // Ensure the product was delivered
                Optional<ShoppingCart> shoppingCartOpt = shoppingCartRepository.findById(order.getShop_id());
                if (shoppingCartOpt.isPresent()) {
                    ShoppingCart shoppingCart = shoppingCartOpt.get();
                    return shoppingCart.getItems().stream()
                            .anyMatch(item -> item.getProduct().getId().equals(productId));
                }
            }
        }

        return false;
    }

    public Review updateReviewComment(UUID reviewId, String newComment) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setComments(newComment);
        return reviewRepository.save(review);
    }

    public Review updateReviewRating(UUID reviewId, Integer newRating) {
        if (newRating < 1 || newRating > 5) {
            throw new IllegalArgumentException("Invalid rating value. Must be between 1 and 5.");
        }
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setRating(newRating);
        return reviewRepository.save(review);
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

    public double getAverageRatingByProductId(UUID productId) {
        List<Integer> ratings = getRatingsByProduct(productId); // Fetch all ratings for the product

        if (ratings.isEmpty()) {
            throw new IllegalArgumentException("No ratings found for the specified product.");
        }

        // Calculate the average rating
        return ratings.stream().mapToInt(Integer::intValue).average().orElse(0.0);
    }

    public int getReviewCountByProductId(UUID productId) {
        return reviewRepository.countByProductId(productId);
    }

}