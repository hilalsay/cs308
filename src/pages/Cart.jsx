import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Cart = () => {
  const { user } = useContext(AuthContext); // Access user state
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to fetch cart from database or localStorage
  useEffect(() => {
    if (user) {
      fetchCartFromDB();
    } else {
      const savedCart = localStorage.getItem("cart");
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [user]);

  // Calculate total price whenever cart items change
  useEffect(() => {
    setTotalPrice(calculateTotal(cartItems));
  }, [cartItems]);

  // Sync cart to localStorage if no user
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Fetch cart from the database for logged-in user
  const fetchCartFromDB = async () => {
    try {
      const response = await fetch(`/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Sync cart to the database for logged-in user
  const syncCartToDB = async (updatedCart) => {
    try {
      await fetch(`/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cartItems: updatedCart }),
      });
    } catch (error) {
      console.error("Failed to sync cart to database:", error);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    if (user) {
      syncCartToDB(updatedCart); // Sync changes to database if logged in
    }
  };

  // Calculate the total price
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
  };

  return (
    <div className="cart-container">
      <h2>Jewelry Cart</h2>
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
            <button onClick={() => alert("Proceeding to checkout...")}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, removeFromCart }) => (
  <div className="cart-item">
    <h4>{item.name}</h4>
    <p>Price: ${item.price.toFixed(2)}</p>
    <p>Quantity: {item.quantityInCart}</p>
    <button onClick={() => removeFromCart(item.id)}>Remove</button>
  </div>
);

export default Cart;
