import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // If the product is already in the cart, increment its quantity
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      // Otherwise, add the product to the cart with quantity 1
      const updatedCart = [...cart, { ...product, quantityInCart: 1 }];
      setCart(updatedCart);
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} has been added to the cart!`);
  };

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
            onClick={addToCart}
            className="mt-6 flex bg-blue-600 text-white justify-between py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
      </div>
    </div>
  );
};

export default Product;
