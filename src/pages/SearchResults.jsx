import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useCart } from "../contexts/CartContext";
import { useSort } from "../contexts/SortContext";
import ProductCard from "./ProductCard";
import "./Products.css"; // Reuse styles from Necklaces

const SearchResultsPage = () => {
  const { searchResults, searchQuery } = useSearchContext();
  const { addToCart } = useCart();
  const { sort, setSortBy, sortedResults } = useSort();
  const [sortOrder, setSortOrder] = useState("popularity"); // Default to popularity

  // Trigger sorting whenever sortOrder changes
  useEffect(() => {
    setSortBy(sortOrder); // Update the global sortBy state
    sort(searchResults, sortOrder); // Sort search results
  }, [sortOrder, searchResults, setSortBy, sort]);




  return (
    <div>
      <h2 className="collection-header">Search Results</h2>

      {/* Search Query Display */}
      {searchQuery && (
        <p className="search-query">
          Showing results for: <strong>{searchQuery}</strong>
        </p>
      )}

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

      {/* Product Display */}
      <div className="product-container">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
