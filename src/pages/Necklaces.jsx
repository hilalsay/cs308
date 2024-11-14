import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Necklaces = () => {
  const [necklaceProducts, setNecklaceProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories and filter for "Necklaces" products
    axios
      .get("http://localhost:8080/api/category")
      .then((response) => {
        const categories = response.data;

        // Find the "Necklaces" category and extract its products
        const necklacesCategory = categories.find(
          (cat) => cat.name === "Necklaces"
        );

        // Set the necklace products if the category is found
        if (necklacesCategory) {
          setNecklaceProducts(necklacesCategory.products);
        } else {
          setError("Necklaces category not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading necklaces...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="collection-header">Necklaces Collection</h2>
      <div className="product-container">
        {necklaceProducts.length > 0 ? (
          necklaceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No necklaces available.</p>
        )}
      </div>
    </div>
  );
};

export default Necklaces;