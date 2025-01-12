import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";
import { useSort } from "../contexts/SortContext";

const Earrings = () => {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sort, setSortBy, sortedResults } = useSort();
  const [sortOrder, setSortOrder] = useState("popularity"); // Default to popularity

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

        // Set the earrings products if the category is found
        if (EarringsCategory) {
          // Filter out products with price -1
          const validProducts = EarringsCategory.products.filter(
            (product) => product.price !== -1
          );
          setSortedProducts(validProducts); // Initialize sorted products
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

  // Trigger sorting whenever sortOrder changes
  useEffect(() => {
    setSortBy(sortOrder); // Update the global sortBy state
    sort(sortedProducts, sortOrder); // Sort search results
  }, [sortOrder, sortedProducts, setSortBy, sort]);

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
          <option value="popularity">Popularity</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="product-container">
        {sortedResults.length > 0 ? (
          sortedResults.map((product) => (
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
