import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [sortOrder, setSortOrder] = useState("popularity"); // Sort state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all categories
        const categoryResponse = await axios.get(
          "http://localhost:8080/api/category"
        );
        const categories = categoryResponse.data;
        setCategories(categories);

        // Fetch all products (without sorting)
        const productResponse = await axios.get("http://localhost:8080/api/products");
        const allProducts = productResponse.data;
        setProducts(allProducts);

        // Organize products by category
        const productsByCategory = categories.reduce((acc, category) => {
          acc[category.id] = allProducts.filter((product) => product.categoryId === category.id);
          return acc;
        }, {});
        setCategoryProducts(productsByCategory);

      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching categories and products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []); // Fetch categories and products once

  // If "All Categories" is selected, flatten all products into one array and filter out products with price -1
  const filteredProducts =
    selectedCategory === ""
      ? products.filter((product) => product.price !== -1)
      : (categoryProducts[selectedCategory] || []).filter(
          (product) => product.price !== -1
        );

  // Sort the products based on the selected sort order
  const sortProducts = (products) => {
    if (sortOrder === "popularity") {
      return products.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sortOrder === "lowToHigh") {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      return products.sort((a, b) => b.price - a.price);
    }
    return products;
  };

  const sortedFilteredProducts = sortProducts(filteredProducts);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Jewelry Collection
      </h2>

      {/* Filters Container */}
      <div className="filters-container flex flex-col md:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label htmlFor="categoryFilter" className="mr-2">
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order Filter */}
        <div>
          <label htmlFor="sortOrder" className="mr-2">
            Sort by:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="popularity">Popularity</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading products...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Render Filtered and Sorted Products */}
      <div>
        {!loading &&
          !error &&
          (selectedCategory === "" ? (
            // Display all products without categorization when "All Categories" is selected
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedFilteredProducts.length > 0 ? (
                sortedFilteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-gray-600">No products available.</p>
              )}
            </div>
          ) : (
            // Display products by category when a specific category is selected
            categories.map((category) => {
              if (category.id === selectedCategory) {
                return (
                  <div key={category.id} className="category-section mb-8">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryProducts[category.id] &&
                      categoryProducts[category.id].length > 0 ? (
                        categoryProducts[category.id].map((product) => {
                          // Only render products with price >= 0
                          if (product.price >= 0) {
                            return (
                              <ProductCard key={product.id} product={product} />
                            );
                          }
                          return null; // Skip product with price < 0
                        })
                      ) : (
                        <p className="text-gray-600">
                          No products available in this category.
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })
          ))}
      </div>
    </div>
  );
};

export default Products;
