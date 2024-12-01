import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../pages/ProductCard"; // Ensure ProductCard is styled properly
import "./Home.css"; // Styling for the Home component
import SortSelector from '../components/SortSelector'; // Ortak bileşeni import et
import { useSort } from '../contexts/SortContext'; // Context'i kullan

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topFiveProducts, setTopFiveProducts] = useState([]);
  const { sort, setSortBy, sortedResults } = useSort();
  const [sortOrder, setSortOrder] = useState("popularity"); // Default to popularity

  useEffect(() => {
    // Fetch popular products
    axios
      .get(`http://localhost:8080/api/products/sorted?sortBy=${sortOrder}`) // Assuming this endpoint provides the products
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    setSortBy(sortOrder); // Update the global sortBy state
    sort(products, sortOrder); // Sort search results
  }, [sortOrder, products, setSortBy,topFiveProducts]);

  useEffect(() => {
    // Get the top 5 products after filtering and sorting
    const filteredProducts = products.slice(0, 5); // Take the top 5
      setTopFiveProducts(filteredProducts); // Update the separate state
  }, [products]);

  return (
    <div className="home-containerH">
      <h2 className="section-titleH">Popular Products</h2>
      <div className="products-carouselH">
        {topFiveProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
