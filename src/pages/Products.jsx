import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import SortSelector from '../components/SortSelector'; // Ortak bileşeni import et
import { useSort } from '../contexts/SortContext'; // Context'i kullan

const Products = () => {
  const [products, setProducts] = useState([]);
  const { sort, setSortBy, sortedResults } = useSort();
  const [sortOrder, setSortOrder] = useState("popularity"); // Default to popularity

  useEffect(() => {
    // Fetch product data
    axios
      .get(`http://localhost:8080/api/products/sorted?sortBy=${sortOrder}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Trigger sorting whenever sortOrder changes
  useEffect(() => {
    setSortBy(sortOrder); // Update the global sortBy state
    sort(products, sortOrder); // Sort search results
  }, [sortOrder, products, setSortBy]);



  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jewelry Collection</h2>
      
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

      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
