// ProductCard.jsx
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={`https://via.placeholder.com/150`}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-model">{product.model}</p>
        <p className="product-price">${product.price}</p>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
