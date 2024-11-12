import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../pages/ProductCard"; // Ensure ProductCard is styled properly
import "./Home.css"; // Styling for the Home component

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch popular products
    axios
      .get("http://localhost:8080/api/products") // Assuming this endpoint provides the products
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

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
