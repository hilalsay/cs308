import React, { useState } from "react";
import axios from "axios";

const ReviewCard = ({ productId, existingReview, token }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `http://localhost:8080/api/reviews`;

      const params = new URLSearchParams();
      params.append("productId", productId);
      if (rating) params.append("rating", rating);
      if (comment) params.append("comments", comment);

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      };

      await axios.post(url, params, { headers });

      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.message || "Failed to submit review");
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
      <h4>Leave a Review</h4>
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
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
};

export default ReviewCard;
