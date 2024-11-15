import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartContext from './CartContext'; // Import CartContext

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext); // Get addToCart from context

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Add product to the cart
      alert(`${product.name} has been added to the cart!`);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button className="PD-add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
