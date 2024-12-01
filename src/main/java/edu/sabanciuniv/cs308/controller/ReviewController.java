package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.sabanciuniv.cs308.service.JwtService;
import edu.sabanciuniv.cs308.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    // Get all reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Get all approved reviews for a product
    @GetMapping("/product/{productId}/reviews")
    public ResponseEntity<List<Review>> getApprovedReviews(@PathVariable UUID productId) {
        List<Review> approvedReviews = reviewService.getApprovedReviewsByProduct(productId);
        return ResponseEntity.ok(approvedReviews);
    }


    // Get all reviews for a product
    @GetMapping("/product/{productId}/comments")
    public ResponseEntity<List<String>> getApprovedComments(@PathVariable UUID productId) {
        List<String> comments = reviewService.getApprovedCommentsByProduct(productId);
        return ResponseEntity.ok(comments);
    }

    // Get all ratings for a product
    @GetMapping("/product/{productId}/ratings")
    public ResponseEntity<List<Integer>> getRatingsByProduct(@PathVariable UUID productId) {
        List<Integer> ratings = reviewService.getRatingsByProduct(productId);
        return ResponseEntity.ok(ratings);
    }

    // Get all comments and ratings by a user
    @GetMapping("/user")
    public ResponseEntity<List<Review>> getReviewsByUser(
            @RequestHeader("Authorization") String token) {
        // Extract user ID from the token
        String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
        UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    // Add a new review (comment and rating)
    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestParam UUID productId,
            @RequestParam UUID orderId,
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comments) {
        try {
            // Extract user ID from the token
            String username = jwtService.extractUserName(token.substring(7)); // Remove "Bearer " prefix
            UUID userId = userService.getUserIdByUsername(username); // Convert username to userId

            // Call the service method to add the review with rating and comments (which can be null)
            Review review = reviewService.addReview(productId, orderId, userId, rating, comments);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            // If an exception is thrown, return the error message
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update a review's comment
    @PutMapping("/{reviewId}/comment")
    public ResponseEntity<?> updateComment(
            @PathVariable UUID reviewId,
            @RequestParam String newComment) {
        try {
            // Call the service method to update the comment
            Review updatedReview = reviewService.updateReviewComment(reviewId, newComment);
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update a review's rating
    @PutMapping("/{reviewId}/rating")
    public ResponseEntity<?> updateRating(
            @PathVariable UUID reviewId,
            @RequestParam Integer newRating) {
        try {
            // Call the service method to update the rating
            Review updatedReview = reviewService.updateReviewRating(reviewId, newRating);
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a review by ID
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable UUID reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }

    // Delete a comment
    @DeleteMapping("/{reviewId}/comment")
    public ResponseEntity<String> deleteComment(@PathVariable UUID reviewId) {
        reviewService.deleteComment(reviewId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // Delete a rating
    @DeleteMapping("/{reviewId}/rating")
    public ResponseEntity<String> deleteRating(@PathVariable UUID reviewId) {
        reviewService.deleteRating(reviewId);
        return ResponseEntity.ok("Rating deleted successfully");
    }

    // Get average rating for a product
    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByProduct(@PathVariable UUID productId) {
        try {
            double averageRating = reviewService.getAverageRatingByProductId(productId);
            return ResponseEntity.ok(averageRating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return bad request if the product has no ratings
        }
    }

    // Get popularity score for a product
    @GetMapping("/product/{productId}/popularity-score")
    public ResponseEntity<Double> findPopularityScore(@PathVariable UUID productId) {
        try {
            double averageRating = reviewService.getAverageRatingByProductId(productId);
            int reviewCount = reviewService.getReviewCountByProductId(productId);
            double popularityScore = averageRating * reviewCount; // Calculate popularity score
            return ResponseEntity.ok(popularityScore);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return bad request if the product has no reviews
        }
    }


    // Approve a review by ID
    @PutMapping("/{reviewId}/approve")
    public ResponseEntity<String> approveComment(@PathVariable UUID reviewId) {
        try {
            reviewService.approveComment(reviewId); // Call the service method to approve the review
            return ResponseEntity.ok("Comment approved successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
