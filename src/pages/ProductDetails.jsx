import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartContext from "../contexts/CartContext"; // Import CartContext
import CommentCard from "./CommentCard"; // Import CommentCard

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [comments, setComments] = useState([]); // Store reviews
  const { addToCart } = useContext(CartContext); // Get addToCart from context
  const [wishlistStatus, setWishlistStatus] = useState(false); // Track wishlist status

  useEffect(() => {
    // Fetch product details
    axios
      .get(`http://localhost:8080/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        if (response.data.imageData) {
          setImage(`data:image/jpeg;base64,${response.data.imageData}`);
        }
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );

    // Fetch average rating for the product
    axios
      .get(
        `http://localhost:8080/api/reviews/product/${productId}/average-rating`
      )
      .then((response) => {
        setAvgRating(response.data || 0);
      })
      .catch((error) =>
        console.error("Error fetching product ratings:", error)
      );

    // Fetch reviews for the product
    axios
      .get(`http://localhost:8080/api/reviews/product/${productId}/reviews`)
      .then((response) => {
        setComments(response.data || []);
      })
      .catch((error) =>
        console.error("Error fetching product reviews:", error)
      );
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    const token = localStorage.getItem("token"); // Get the JWT token
    if (token && product) {
      axios
        .post(
          `http://localhost:8080/api/wishlist/me/add/${product.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setWishlistStatus(true); // Update wishlist status
          alert("Product added to wishlist!");
        })
        .catch((error) => {
          console.error("Error adding product to wishlist:", error);
          alert("Failed to add to wishlist.");
        });
    } else {
      alert("You need to log in first.");
    }
  };

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[98.7%] w-full">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="w-full sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt="Placeholder"
                className="w-full sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product.name}</h1>

          {product.discountRate && product.discountRate > 0 ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                ${product.price.toFixed(2)}
              </span>
              <span>${product.discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span>
          )}

          <p className="my-5 text-gray-500 md:w-4/5">{product.description}</p>

          {/* Additional Product Details */}
          <p className="my-2">
            <strong>Product ID:</strong> {productId}
          </p>
          <p className="my-2">
            <strong>Model:</strong> {product.model}
          </p>
          <p className="my-2">
            <strong>Serial Number:</strong> {product.serialNumber}
          </p>
          <p className="my-2">
            <strong>Warranty Status:</strong> {product.warrantyStatus}
          </p>
          <p className="my-2">
            <strong>Distributor Information:</strong>{" "}
            {product.distributorInformation}
          </p>

          {/* Average Rating */}
          <div className="my-4">
            <strong>Rating:</strong> {avgRating.toFixed(1)} / 5{" "}
            {renderStars(avgRating)}
          </div>

          {/* Stock Quantity */}
          <p
            className={`my-2 ${
              product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stockQuantity > 0
              ? `In Stock: ${product.stockQuantity}`
              : "Out of Stock"}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`px-8 py-3 text-sm mt-5 ${
          product.stockQuantity > 0
            ? "bg-black text-white active:bg-gray-700"
            : "bg-gray-400 text-gray-800 cursor-not-allowed"
        }`}
        onClick={handleAddToCart}
        disabled={product.stockQuantity <= 0}
      >
        Add to Cart
      </button>

      {/* Add to Wishlist Button */}
      <button
        className={`px-8 py-3 text-sm mt-5 ml-3 ${
          wishlistStatus
            ? "bg-gray-400 text-gray-800 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        onClick={handleAddToWishlist}
        disabled={wishlistStatus}
      >
        {wishlistStatus ? "Added to Wishlist" : "Add to Wishlist"}
      </button>

      {/* Comment Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium">Customer Reviews</h2>
        {comments.length > 0 ? (
          <CommentCard comments={comments} />
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
