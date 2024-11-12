// Product.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the specific product from the backend
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <img
        src={`https://via.placeholder.com/300`}
        alt={product.name}
        className="product-detail-image"
      />
      <div className="product-detail-info">
        <h2 className="product-detail-name">{product.name}</h2>
        <p className="product-detail-model">
          <strong>Model:</strong> {product.model}
        </p>
        <p className="product-detail-serial">
          <strong>Serial Number:</strong> {product.serialNumber}
        </p>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-stock">
          <strong>In Stock:</strong> {product.stockQuantity}
        </p>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <p className="product-detail-warranty">
          <strong>Warranty:</strong> {product.warrantyStatus}
        </p>
        <p className="product-detail-distributor">
          <strong>Distributor:</strong> {product.distributorInformation}
        </p>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default Product;
