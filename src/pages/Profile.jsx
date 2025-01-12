import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Assuming AuthContext is already defined
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { token } = useContext(AuthContext); // Assuming token is provided in AuthContext
  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]); // To hold user's reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile and reviews from the backend
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to view your profile.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    const fetchUserProfileAndReviews = async () => {
      try {
        // Fetch user profile
        const profileResponse = await axios.get(
          "http://localhost:8080/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserProfile(profileResponse.data);

        // Fetch user reviews (comments and ratings)
        const reviewsResponse = await axios.get(
          "http://localhost:8080/api/reviews/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserReviews(reviewsResponse.data); // Set the user's reviews
        console.log("userprofile: ", profileResponse.data);

        setLoading(false); // Stop loading after fetching
      } catch (error) {
        setError("Failed to fetch profile or reviews. Please try again.");
        setLoading(false); // Stop loading on error
      }
    };

    fetchUserProfileAndReviews();
  }, [token, navigate]);

  // Render loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-page">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="profile-info space-y-4">
        <div className="form-group">
          <label className="block font-medium mb-1">Full Name:</label>
          <p>{userProfile.username}</p>
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">User ID:</label>
          <p>{userProfile.id}</p>
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Email:</label>
          <p>{userProfile.email}</p>
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Address:</label>
          <p>{userProfile.homeAddress}</p>
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Tax ID:</label>
          <p>{userProfile.taxId}</p>
        </div>

        {/* Display user's reviews (comments and ratings) */}
        <div className="form-group mt-4">
          <h3 className="text-xl font-semibold">My Reviews</h3>
          {userReviews.length > 0 ? (
            userReviews.map((review) => (
              <div key={review.id} className="review-item border-b mb-4 pb-4">
                <div className="product-name">
                  <strong>Product:</strong> {review.productId}{" "}
                  {/* Adjust as needed to show product name */}
                </div>
                <div className="rating">
                  <strong>Rating:</strong> {review.rating}
                </div>
                <div className="comment">
                  <strong>Comment:</strong> {review.comments || "No comment"}
                </div>
              </div>
            ))
          ) : (
            <p>You haven't left any reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
