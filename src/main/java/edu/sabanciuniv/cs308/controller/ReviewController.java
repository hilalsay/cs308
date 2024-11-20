package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Get all reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Get all reviews for a product
    @GetMapping("/product/{productId}/comments")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    // Get all ratings for a product
    @GetMapping("/product/{productId}/ratings")
    public ResponseEntity<List<Integer>> getRatingsByProduct(@PathVariable UUID productId) {
        List<Integer> ratings = reviewService.getRatingsByProductId(productId);
        return ResponseEntity.ok(ratings);
    }

    // Get all comments and ratings by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    // Add a new review (comment and rating)
    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestParam UUID productId,
            @RequestParam UUID userId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comments) {
        try {
            Review review = reviewService.addReview(productId, userId, rating, comments);
            return ResponseEntity.ok(review);
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
}
