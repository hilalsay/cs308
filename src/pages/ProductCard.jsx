// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {/* Link to product detail page */}
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img
          src={`https://via.placeholder.com/150`}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        {/* Product name links to the detail page */}
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <p className="product-model">
          <strong>Model:</strong> {product.model}
        </p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>

        <button
          className="add-to-cart-button"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
