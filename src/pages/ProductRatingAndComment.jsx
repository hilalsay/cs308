import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductRatingAndComment = ({ productId, userId, isDelivered }) => {
  const [rating, setRating] = useState(1);
  const [comments, setComments] = useState('');
  const [existingReviews, setExistingReviews] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch existing reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}/reviews`);
        setExistingReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchReviews();
  }, [productId]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      productId,
      userId,
      rating,
      comments,
    };

    try {
      const response = await axios.post('/api/reviews', reviewData);
      if (response.status === 201) {
        setMessage('Review submitted successfully!');
        setRating(1);  // Reset rating and comments after submission
        setComments('');
        setExistingReviews([...existingReviews, response.data]); // Add the new review to the list
      }
    } catch (error) {
      setMessage('Failed to submit review. Please try again.');
    }
  };

  return (
    <div>
      <h4>Rate this Product</h4>
      {/* Show existing reviews */}
      <div>
        <h5>Existing Reviews</h5>
        {existingReviews.length > 0 ? (
          existingReviews.map((review) => (
            <div key={review.reviewId}>
              <p>Rating: {review.rating} stars</p>
              <p>{review.comments}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Only show the form if the product is delivered */}
      {isDelivered && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Rating (1-5): </label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div>
            <label>Comment: </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* Show message after submitting */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductRatingAndComment;
