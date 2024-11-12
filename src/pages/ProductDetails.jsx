// ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css"; // CSS for styling

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details by ID
    axios
      .get(`http://localhost:8080/api/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [productId]);

  const handleAddToCart = () => {
    // Here you would typically add the product to the user's shopping cart
    console.log("Product added to cart:", product);
  };

  const handleRateProduct = () => {
    // For now, just log the rating
    console.log("Product rated!");
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    console.log("Comment submitted:", comment);
  };

  const [comment, setComment] = useState("");

  if (!product) {
    return <div>Loading...</div>; // Show loading if product data is not yet fetched
  }

  return (
    <div className="PD-product-details-container">
      <div className="PD-product-details">
        <div className="PD-product-image-container">
          <img
            src={`https://via.placeholder.com/500x500`} // Replace with actual image URL
            alt={product.name}
            className="PD-product-image"
          />
        </div>

        <div className="PD-product-info">
          <h1 className="PD-product-name">{product.name}</h1>
          <p className="PD-product-model">
            <strong>Model:</strong> {product.model}
          </p>
          <p className="PD-product-price">${product.price.toFixed(2)}</p>
          <p className="PD-product-description">{product.description}</p>

          <button className="PD-add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {/* Rating Section */}
          <div className="PD-rating-section">
            <button className="PD-rate-button" onClick={handleRateProduct}>
              Rate this Product
            </button>
          </div>

          {/* Comment Section */}
          <div className="PD-comment-section">
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                className="PD-comment-input"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                cols="50"
              />
              <button className="PD-comment-submit" type="submit">
                Submit Comment
              </button>
            </form>
            <p>
              <strong>Dummy Comment:</strong> This product is amazing! Highly
              recommend!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
