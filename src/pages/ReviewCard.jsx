import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewCard = ({ productId, orderId, token, orderStatus }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditable = orderStatus === "DELIVERED"; // Check if reviews can be edited

  useEffect(() => {
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
        if (!existingReview.reviewId) {
          throw new Error("Review ID is missing");
        }

        // Update the comment (rating is optional)
        if (comment) {
          await axios.put(
            `http://localhost:8080/api/reviews/${existingReview.reviewId}/comment`,
            new URLSearchParams({ newComment: comment }),
            { headers }
          );
        }

        if (rating > 0) {
          await axios.put(
            `http://localhost:8080/api/reviews/${existingReview.reviewId}/rating`,
            new URLSearchParams({ newRating: rating }),
            { headers }
          );
        }

        alert("Review updated successfully!");
      } else {
        // Add a new review with `orderId`
        const formData = new URLSearchParams({
          productId,
          orderId,
          comments: comment,
        });
        if (rating > 0) {
          formData.append("rating", rating);
        }

        await axios.post("http://localhost:8080/api/reviews", formData, {
          headers,
        });
        alert("Review submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data || "An error occurred");
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
          onClick={() => isEditable && setRating(starValue)} // Disable click if not editable
          style={{
            cursor: isEditable ? "pointer" : "not-allowed",
            color: starValue <= rating ? "#FFD700" : "#ccc",
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
          disabled={!isEditable}
          style={{
            marginLeft: "8px",
            width: "100%",
            height: "50px",
            padding: "4px",
            border: "1px solid #000",
            borderRadius: "4px",
            outline: "2px solid #007BFF",
            backgroundColor: !isEditable ? "#f9f9f9" : "white",
            cursor: !isEditable ? "not-allowed" : "text",
          }}
        />
      </div>
      {/* {error && <p style={{ color: "red" }}>{error}</p>}
      {!comment && rating === 0 && (
        <p style={{ color: "red", marginTop: "8px" }}>
          Please provide a comment or a rating.
        </p>
      )} */}
      <button
        onClick={handleSubmit}
        disabled={!isEditable || loading || (!comment && rating === 0)}
        style={{
          padding: "8px 16px",
          border: "none",
          backgroundColor:
            !isEditable || (!comment && rating === 0) ? "#ccc" : "#007BFF",
          color: "#fff",
          borderRadius: "4px",
          cursor:
            !isEditable || (!comment && rating === 0)
              ? "not-allowed"
              : "pointer",
        }}
      >
        {loading
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </button>
      {!isEditable && (
        <p style={{ color: "red", marginTop: "8px" }}>
          Reviews can only be updated or sent for delivered orders.
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
