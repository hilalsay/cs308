// Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // Import the ProductCard component

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data); // Set the products into state
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="product-container">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
