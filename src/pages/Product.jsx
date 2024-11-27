import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from './CartContext';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // This will add the product to the cart
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="grid flex justify-center justify-between grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
        <img
          src={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-2">Model: {product.model}</p>
          <p className="mt-2 text-red-600 font-bold">${product.price.toFixed(2)}</p>
          <p className="mt-4">{product.description}</p>
          
        </div>
        <button
            onClick={() => handleAddToCart(product)}
            className="mt-6 flex bg-blue-600 text-white justify-between py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
      </div>
    </div>
  );
};

export default Product;
