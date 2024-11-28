import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axios from "axios";

const CheckPage = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useContext(AuthContext);
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    paymentMethod: "Credit Card", // Default payment method
  });
  const navigate = useNavigate();

  // Check if token is available
  useEffect(() => {
    if (!token) {
      alert("You must be logged in to proceed with the checkout.");
      navigate("/login"); // Redirect to login page if no token
    }
  }, [token, navigate]);

  // Handle checkout
  const handleCheckout = async () => {
    /*
    if (!checkoutData.address.trim()) {
      alert("Please provide a valid address.");
      return;
    }
    */

    try {
      // Make the API call to confirm the order
      console.log("checkpage Token:", token);
      const response = await axios.post(
        `http://localhost:8080/api/cart/confirm?paymentMethod=${encodeURIComponent(paymentMethod)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      //const responseText = await response; // Get the response as text
      //console.log("Response Text:", responseText);

      try {
        //const data = JSON.parse(responseText);
        if (response.status === 200) {
          navigate("/invoice");
          clearCart(); // Optionally clear the cart after successful order
        } else {
          console.error("Checkout failed:", data);
          alert("Error: " + (data.message || "Unable to process your order."));
        }
      } catch (e) {
        console.error("Response parsing error:", e);
        //alert("Error: " + responseText); // Show the raw response in case of parsing failure
      }
      
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred while processing your order. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="form">
        <div className="form-group">
          {/*
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={checkoutData.address}
            
            onChange={(e) =>
              setCheckoutData({ ...checkoutData, address: e.target.value })
            }
            required
          />
           */}
          
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={checkoutData.paymentMethod}
            onChange={(e) =>
              setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
            }
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
        <button onClick={handleCheckout}>Confirm Order</button>
      </div>
    </div>
  );
};

export default CheckPage;