import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewCard = ({ productId, token }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the existing review for the product if user is authenticated
    if (token) {
      axios
        .get("http://localhost:8080/api/reviews/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userReviews = response.data;
          const userReviewForProduct = userReviews.find(
            (review) => review.productId === productId
          );
          if (userReviewForProduct) {
            setExistingReview(userReviewForProduct);
            setRating(userReviewForProduct.rating || 0);
            setComment(userReviewForProduct.comments || "");
          }
        })
        .catch((err) => {
          console.error("Error fetching user's reviews:", err);
        });
    }
  }, [productId, token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      };

      if (existingReview) {
        // Ensure reviewId is passed correctly
        if (!existingReview.reviewId) {
          throw new Error("Review ID is missing");
        }

        // Update existing review
        await axios.put(
          `http://localhost:8080/api/reviews/${existingReview.reviewId}/comment`, // Ensure correct reviewId is used
          { newComment: comment },
          { headers }
        );
        await axios.put(
          `http://localhost:8080/api/reviews/${existingReview.reviewId}/rating`, // Ensure correct reviewId is used
          { newRating: rating },
          { headers }
        );
        alert("Review updated successfully!");
      } else {
        // Add a new review
        await axios.post(
          "http://localhost:8080/api/reviews",
          new URLSearchParams({
            productId,
            rating,
            comments: comment,
          }),
          { headers }
        );
        alert("Review submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={starValue}
          onClick={() => setRating(starValue)}
          style={{
            cursor: "pointer",
            color: starValue <= rating ? "#FFD700" : "#ccc", // Gold for selected, gray for unselected
            fontSize: "24px",
          }}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      <h4>{existingReview ? "Update Your Review" : "Leave a Review"}</h4>
      <div style={{ marginBottom: "8px" }}>
        <label>
          <strong>Rating:</strong>
        </label>
        <div style={{ display: "inline-block", marginLeft: "8px" }}>
          {renderStars()}
        </div>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <label>
          <strong>Comment:</strong>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            marginLeft: "8px",
            width: "100%",
            height: "50px",
            padding: "4px",
            border: "1px solid #000",
            borderRadius: "4px",
            outline: "2px solid #007BFF",
          }}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "8px 16px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </button>
    </div>
  );
};

export default ReviewCard;
