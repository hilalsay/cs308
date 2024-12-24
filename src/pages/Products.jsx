import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [sortOrder, setSortOrder] = useState("popularity");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all categories
        const categoryResponse = await axios.get("http://localhost:8080/api/category");
        const categories = categoryResponse.data;
        setCategories(categories);

        // Fetch products for each category
        const productPromises = categories.map((category) =>
          axios
            .get("http://localhost:8080/api/category/products/sorted", {
              params: { categoryId: category.id, sortBy: sortOrder },
            })
            .then((res) => ({ [category.id]: res.data }))
        );

        const productsByCategory = await Promise.all(productPromises);
        const productsMap = productsByCategory.reduce(
          (acc, cur) => ({ ...acc, ...cur }),
          {}
        );
        setCategoryProducts(productsMap);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching categories and products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [sortOrder]);

  // If "All Categories" is selected, flatten all products into one array
  const filteredProducts =
    selectedCategory === ""
      ? Object.values(categoryProducts).flat() // Flatten all products into a single array
      : categoryProducts[selectedCategory] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jewelry Collection</h2>

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

      {/* Render Filtered Products */}
      <div>
        {!loading &&
          !error &&
          (selectedCategory === "" ? (
            // Display all products without categorization when "All Categories" is selected
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                    <h3 className="text-xl font-bold text-gray-700 mb-4">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryProducts[category.id] && categoryProducts[category.id].length > 0 ? (
                        categoryProducts[category.id].map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))
                      ) : (
                        <p className="text-gray-600">No products available in this category.</p>
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
