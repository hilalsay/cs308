import React from "react";
import { Link } from "react-router-dom";
import { useCart} from '../contexts/CartContext'; 

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();

  /*
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
  };*/


  return (
    <div className="product-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {/* Link to product detail page */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
      </Link>

      <p className="text-sm text-gray-500">Model: {product.model}</p>
      <p className="text-red-600 font-bold">${product.price.toFixed(2)}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
