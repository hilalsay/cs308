import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../contexts/CartContext'; 

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Handle base64 image or fallback to placeholder
  const imageUrl = product.imageData
    ? `data:image/jpeg;base64,${product.imageData}` // Assuming imageData is base64 encoded
    : "https://via.placeholder.com/150"; // Placeholder if no image

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

      <p className="text-sm text-gray-500">Model: {product.model}</p>
      <p className="text-red-600 font-bold">${product.price.toFixed(2)}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
