import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useCart } from "../contexts/CartContext";
import "./Products.css"; // Reuse styles from Necklaces

const SearchResultsPage = () => {
  const { searchResults, searchQuery } = useSearchContext();
  const { addToCart } = useCart();

  const [sortedResults, setSortedResults] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    // Apply sorting whenever sortOrder or searchResults changes
    let sorted = [...searchResults];

    if (sortOrder === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setSortedResults(sorted);
  }, [sortOrder, searchResults]);

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
          <option value="">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      {/* Product Display */}
      <div className="product-container">
        {sortedResults.length > 0 ? (
          sortedResults.map((product) => {
            const imageUrl = product.imageData
              ? `data:image/jpeg;base64,${product.imageData}`
              : "https://via.placeholder.com/150";

            return (
              <div
                key={product.id}
                className="product-card"
              >
                {/* Link to product details */}
                <Link to={`/product/${product.id}`}>
                  <img
                    className="w-full h-40 object-cover rounded-md mb-4"
                    src={imageUrl} // Use imageUrl here
                    alt={product.name}
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    {product.name}
                  </p>
                </Link>
                <p className="text-red-600 text-lg font-bold">
                  ${product.price}
                </p>

                {/* Stock Information */}
                <p
                  className={`text-sm ${
                    product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stockQuantity > 0
                    ? `In Stock: ${product.stockQuantity}`
                    : "Out of Stock"}
                </p>

                {/* Add to Cart Button */}
                <button
                  className={`mt-4 w-full py-2 rounded-lg ${
                    product.stockQuantity > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-800 cursor-not-allowed"
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
