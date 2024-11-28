import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import SortSelector from '../components/SortSelector'; // Ortak bileşeni import et
import { useSort } from '../contexts/SortContext'; // Context'i kullan

const Products = () => {
  const [products, setProducts] = useState([]);
  const { sortBy, setSortBy } = useSort(); // Context üzerinden sıralama durumunu al

  useEffect(() => {
    // Fetch product data
    axios
      .get(`http://localhost:8080/api/products/sorted?sortBy=${sortBy}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [sortBy]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jewelry Collection</h2>
      <SortSelector /> {/* Buraya SortSelector'ı eklemelisiniz */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
