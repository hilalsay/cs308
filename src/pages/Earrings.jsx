import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Earrings = () => {
  const [necklaceProducts, setNecklaceProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(""); // State for sorting order

  useEffect(() => {
    // Fetch categories and filter for "Earrings" products
    axios
      .get("http://localhost:8080/api/category")
      .then((response) => {
        const categories = response.data;

        // Find the "Earrings" category and extract its products
        const EarringsCategory = categories.find(
          (cat) => cat.name === "Earrings"
        );

        // Set the necklace products if the category is found
        if (EarringsCategory) {
          setNecklaceProducts(EarringsCategory.products);
          setSortedProducts(EarringsCategory.products); // Initialize sorted products
        } else {
          setError("Earrings category not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Apply sorting whenever the sortOrder changes
    if (sortOrder === "lowToHigh") {
      setSortedProducts(
        [...necklaceProducts].sort((a, b) => a.price - b.price)
      );
    } else if (sortOrder === "highToLow") {
      setSortedProducts(
        [...necklaceProducts].sort((a, b) => b.price - a.price)
      );
    } else {
      setSortedProducts(necklaceProducts); // Default: no sorting
    }
  }, [sortOrder, necklaceProducts]);

  if (loading) return <div>Loading Earrings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="collection-header">Earrings Collection</h2>

      {/* Sorting Options */}
      <div className="sorting-container">
        <label htmlFor="sortOrder">Sort by: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      <div className="product-container">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No Earrings available.</p>
        )}
      </div>
    </div>
  );
};

export default Earrings;