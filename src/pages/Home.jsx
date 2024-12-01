import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../pages/ProductCard"; // Ensure ProductCard is styled properly
import "./Home.css"; // Styling for the Home component
import SortSelector from '../components/SortSelector'; // Ortak bileşeni import et
import { useSort } from '../contexts/SortContext'; // Context'i kullan

const Home = () => {
  const [products, setProducts] = useState([]);
  const { sortBy, setSortBy } = useSort(); // Context üzerinden sıralama durumunu al

  useEffect(() => {
    // Fetch popular products
    axios
      .get(`http://localhost:8080/api/products/sorted?sortBy=${sortBy}`) // Assuming this endpoint provides the products
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [sortBy]);

  return (
    <div className="home-containerH">
      <h2 className="section-titleH">Popular Products</h2>
      <div className="products-carouselH">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
