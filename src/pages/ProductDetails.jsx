import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartContext from "../contexts/CartContext"; // Import CartContext

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [avgRating, setAvgRating] = useState(0); // State for average rating
  const [totalReviews, setTotalReviews] = useState(0); // State for total reviews
  const { addToCart } = useContext(CartContext); // Get addToCart from context

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
      ) // Backend endpoint
      .then((response) => {
        setAvgRating(response.data || 0); // Example: { avgRating: 4.2 }
        // Optionally, fetch the total number of reviews if available
        // You can modify the backend to return this if needed
      })
      .catch((error) =>
        console.error("Error fetching product ratings:", error)
      );
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Add product to the cart
    }
  };

  const renderStars = () => {
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating - fullStars >= 0.5;
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
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
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
          <p className="mt-5 text-3xl font-medium">${product.price}</p>
          <p className="my-5 text-gray-500 md:w-4/5">{product.description}</p>
          {/* Average Rating */}
          <div className="my-4">
            <strong>Rating:</strong> {avgRating.toFixed(1)} / 5 {renderStars()}{" "}
            {/* Render the stars */}
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
          {/* Additional Details */}
          <div className="mt-5 text-gray-700 space-y-2">
            <p>
              <strong>Model:</strong> {product.model || "N/A"}
            </p>
            <p>
              <strong>Serial Number:</strong> {product.serialNumber || "N/A"}
            </p>
            <p>
              <strong>Warranty Status:</strong>{" "}
              {product.warrantyStatus || "N/A"}
            </p>
            <p>
              <strong>Distributor:</strong>{" "}
              {product.distributorInformation || "N/A"}
            </p>
          </div>
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
    </div>
  );
};

export default ProductDetails;
