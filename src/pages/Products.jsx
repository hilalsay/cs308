import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product data
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jewelry Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
