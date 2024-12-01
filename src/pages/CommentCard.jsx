import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";




const CommentCard = () => {

  const { productId } = useParams();
  const [commentsWithUsernames, setCommentsWithUsernames] = useState([]);

  useEffect (()=>{
  
    axios
        .get(`http://localhost:8080/api/reviews/product/${productId}/reviews`)
        .then(async (response) => {
          const reviews = response.data || [];
          const reviewsWithUsernames = await Promise.all(
            reviews.map(async (review) => {
              try {
                //console.log(review);
                const userResponse = await axios.get(
                  `http://localhost:8080/api/auth/users/${review.userId}`
                );
                return {
                  ...review,
                  username: userResponse.data.username, // Map username
                };
              } catch (error) {
                console.error("Error fetching username:", error);
                return { ...review, username: "Unknown User" }; // Fallback
              }
            })
          );
          console.log("reviews: ", reviewsWithUsernames);
          setCommentsWithUsernames(reviewsWithUsernames);
        })
        .catch((error) =>
          console.error("Error fetching product reviews:", error)
        );
  
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
      {commentsWithUsernames.length > 0 ? (
        commentsWithUsernames.map((review) => (
          <div className="border-b py-4" key={review.reviewId}>
            <div className="flex justify-between">
              <span className="font-medium"> {review.username}</span>
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
