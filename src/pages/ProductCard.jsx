import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Handle base64 image or fallback to placeholder
  const imageUrl = product.imageData
    ? `data:image/jpeg;base64,${product.imageData}` // Assuming imageData is base64 encoded
    : "https://via.placeholder.com/150"; // Placeholder if no image



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
    <div className="product-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {/* Link to product detail page */}
      <Link to={`/product/${product.id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
      </Link>

      {product.averageRating !== null && (
        <div className="my-4"> 
          <strong>Rating:</strong> {product.averageRating.toFixed(2)} / 5{" "}
          {renderStars(product.averageRating)}
        </div>
      )}


      <p className="text-sm text-gray-500">Model: {product.model}</p>
      <p className="text-red-600 font-bold">${product.price.toFixed(2)}</p>

      {/* Stock Information */}
      <p
        className={`text-sm ${
          product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.stockQuantity > 0
          ? `In Stock: ${product.stockQuantity}`
          : "Out of Stock"}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className={`mt-3 w-full py-2 rounded-lg ${
          product.stockQuantity > 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-gray-800 cursor-not-allowed"
        }`}
        disabled={product.stockQuantity <= 0}
      >
        {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
