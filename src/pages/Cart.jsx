import React from "react";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const totalPrice = calculateTotal(cartItems);

  return (
    <div className="border-t pt-14">
      <div className="text-4xl mb-5 ">
        <h1>Jewelry Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
            />
          ))}
          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>

            <button
              onClick={() => {
                if (token) {
                  navigate("/checkout");
                } else {
                  navigate("/login");
                }
              }}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, removeFromCart }) => {
  // Construct the image URL or use a placeholder
  const imageUrl = item.product.imageData
    ? `data:image/jpeg;base64,${item.product.imageData}`
    : "https://via.placeholder.com/150";

  return (
    <div className="py-4 border-t border-b text-gray-700 grid grid-cols-[1fr_4fr_0.5fr_0.5fr] sm:grid-cols-[1fr_4fr_2fr_0.5fr] items-center gap-8">
      {/* Image */}
      <img
        src={imageUrl}
        alt={item.product.name || "Product Image"}
        className="w-16 h-16 object-cover rounded-md"
      />

      {/* Product Details */}
      <div>
        <h4 className="font-semibold">{item.product.name}</h4>
        <p className="text-gray-500 text-sm">{item.product.description}</p>
      </div>

      {/* Price */}
      <p>Price: ${item.price.toFixed(2)}</p>

      {/* Quantity */}
      <p>Quantity: {item.quantity}</p>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item)}
        className="text-red-600 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default Cart;
