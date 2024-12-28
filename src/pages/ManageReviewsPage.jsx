import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reviews");
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reviews");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle approve review
  const handleApprove = async (reviewId) => {
    try {
      await axios.put(`http://localhost:8080/api/reviews/${reviewId}/approve`);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId ? { ...review, approved: true } : review
        )
      );
    } catch (err) {
      console.error("Error approving review:", err);
    }
  };

  // Handle decline review
  const handleDecline = async (reviewId) => {
    try {
      await axios.put(`http://localhost:8080/api/reviews/${reviewId}/decline`);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, approved: false, comments: null }
            : review
        )
      );
    } catch (err) {
      console.error("Error declining review:", err);
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="manage-reviews-page max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Manage Reviews
      </h1>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.reviewId}
              className="review-card mb-4 p-4 border rounded-lg shadow-md"
            >
              <p className="font-semibold">User ID: {review.userId}</p>
              <p className="font-semibold">Review ID: {review.reviewId}</p>
              <p>
                <strong>Product ID:</strong> {review.productId}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>
                <strong>Comments:</strong>{" "}
                {review.comments || (
                  <span className="italic text-gray-500">No comments</span>
                )}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(review.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {review.comments === null
                  ? "Not Approved"
                  : review.approved
                  ? "Approved"
                  : "Pending"}
              </p>
              <div className="mt-4 flex justify-end space-x-4">
                {!review.approved && review.comments && (
                  <>
                    <button
                      onClick={() => handleApprove(review.reviewId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(review.reviewId)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Decline
                    </button>
                  </>
                )}
                {!review.comments && (
                  <p className="text-red-500 italic">
                    Actions unavailable for reviews without comments
                  </p>
                )}
                {review.approved && (
                  <p className="text-green-500">Review Approved</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageReviewsPage;
