import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentCard = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews for the specific product using the new endpoint
    axios
      .get(`http://localhost:8080/api/reviews/product/${productId}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [productId]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div>
        {Array.from({ length: fullStars }, (_, i) => (
          <span
            key={`full-${i}`}
            style={{ color: "#FFD700", fontSize: "24px" }}
          >
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span style={{ color: "#FFD700", fontSize: "24px" }}>☆</span>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={`empty-${i}`} style={{ color: "#ccc", fontSize: "24px" }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div className="border-b py-4" key={review.reviewId}>
            <div className="flex justify-between">
              <span className="font-medium">User {review.userId}</span>
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center my-2">
              <span className="font-bold mr-2">Rating:</span>
              {renderStars(review.rating)}
            </div>
            <p>{review.comments}</p>
          </div>
        ))
      ) : (
        <p>No reviews found for this product.</p>
      )}
    </div>
  );
};

export default CommentCard;
