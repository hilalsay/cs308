import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axios from "axios";

const CheckPage = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    address: "",
  });
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: "Credit Card", // Default payment method
    cardNumber: "",
    expiryMonth: "01",
    expiryYear: "24",
    cvv: "",
  });

  const navigate = useNavigate();

  // Check if token is available and user is logged in
  useEffect(() => {
    if (!token) {
      alert("You must be logged in to proceed with the checkout.");
      navigate("/login"); // Redirect to login page if no token
    }
  }, [token, navigate]);

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  
  const totalPrice = calculateTotal(cartItems);
  
  // Handle checkout (API call)
  const handleCheckout = async () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.address) {
      alert("Please provide your full name, email, and address.");
      return;
    }

    // Validate payment method (for credit/debit card)
    if (checkoutData.paymentMethod === "Credit Card" || checkoutData.paymentMethod === "Debit Card") {
      if (!checkoutData.cardNumber || checkoutData.cardNumber.length !== 19) {
        alert("Please enter a valid 16-digit card number with spaces.");
        return;
      }
      if (!checkoutData.cvv || checkoutData.cvv.length !== 3) {
        alert("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    try {
      // Real API interaction (POST request with token and paymentMethod)
      const response = await axios.post(
        `http://localhost:8080/api/cart/confirm?paymentMethod=${encodeURIComponent(checkoutData.paymentMethod)}`,
        { userInfo, cartItems, totalPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        navigate("/invoice", {
          state: { userInfo, cartItems, totalPrice },
        });
        clearCart(); // Clear cart after successful checkout
      } else {
        console.error("Checkout failed:", response.data);
        alert(
          "Error: " + (response.data?.message || "Unable to process your order.")
        );
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred while processing your order. Please try again.");
    }
  };

  // Format card number input
  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\s/g, "");
    const formatted = input
      .match(/.{1,4}/g)
      ?.join(" ")
      .substring(0, 19);
    setCheckoutData({ ...checkoutData, cardNumber: formatted || "" });
  };

  return (
    <div className="checkout-page p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="form space-y-4">
        {/* User Information */}
        <div className="form-group">
          <label htmlFor="fullName" className="block font-medium mb-1">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            value={userInfo.fullName}
            onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
            className="border rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="block font-medium mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="border rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="block font-medium mb-1">
            Address:
          </label>
          <input
            type="text"
            id="address"
            value={userInfo.address}
            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            className="border rounded-lg p-2 w-full"
            required
          />
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="paymentMethod" className="block font-medium mb-1">
            Payment Method:
          </label>
          <select
            id="paymentMethod"
            value={checkoutData.paymentMethod}
            onChange={(e) =>
              setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
            }
            className="border rounded-lg p-2 w-full"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
          </select>
        </div>

        {/* Card Details */}
        {(checkoutData.paymentMethod === "Credit Card" ||
          checkoutData.paymentMethod === "Debit Card") && (
          <>
            <div className="form-group">
              <label htmlFor="cardNumber" className="block font-medium mb-1">
                Card Number:
              </label>
              <input
                type="text"
                id="cardNumber"
                value={checkoutData.cardNumber}
                onChange={handleCardNumberChange}
                className="border rounded-lg p-2 w-full"
                maxLength="19"
              />
            </div>
            <div className="form-group flex space-x-2">
              <div>
                <label htmlFor="expiryMonth" className="block font-medium mb-1">
                  Expiry Month:
                </label>
                <select
                  id="expiryMonth"
                  value={checkoutData.expiryMonth}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, expiryMonth: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="expiryYear" className="block font-medium mb-1">
                  Expiry Year:
                </label>
                <select
                  id="expiryYear"
                  value={checkoutData.expiryYear}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, expiryYear: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={String(24 + i)}>
                      {String(24 + i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cvv" className="block font-medium mb-1">
                CVV:
              </label>
              <input
                type="text"
                id="cvv"
                value={checkoutData.cvv}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, cvv: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
                maxLength="3"
              />
            </div>
          </>
        )}

        {/* Total Price */}
        <div className="form-group font-semibold text-lg">
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>

        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white p-2 rounded-lg w-full mt-4"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckPage;
