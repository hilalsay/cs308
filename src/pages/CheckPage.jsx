import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Calculate total price
  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  const totalPrice = calculateTotal(cartItems);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 4) {
      value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space after every 4 digits
    }
    e.target.value = value.substring(0, 19); // Limit to 19 characters
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const expirationMonth = e.target.elements.expirationMonth?.value;
    const expirationYear = e.target.elements.expirationYear?.value;
  
    if (!expirationMonth || !expirationYear) {
      alert("Expiration date is required.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to complete the checkout.");
      setLoading(false);
      return;
    }

    // Gather user and payment data
    const checkoutData = {
      paymentMethod,
      userInfo: {
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        address: e.target.address.value,
      },
      cartItems,
      totalPrice,
      ...(paymentMethod === "credit_card" && {
        paymentDetails: {
          cardNumber: e.target.cardNumber.value.replace(/\s/g, ""), // Remove spaces
          expirationDate: `${e.target.expirationMonth.value}/${e.target.expirationYear.value}`,
          cvv: e.target.cvv.value,
        },
      }),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/confirm",
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/invoice", { state: response.data });
      }
    } catch (error) {
      console.error("Checkout failed:", error.response || error.message);
      alert("Failed to complete the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-6 pt-5 sm:pt-14 min-h-[80vh]">
      {/* Order Summary Section */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <h2 className="text-2xl font-semibold border-b pb-2">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantityInCart}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantityInCart).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <h3 className="text-lg font-semibold">Total:</h3>
              <p className="text-lg font-semibold">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* User Information and Payment Section */}
      <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
          Shipping Information
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleCheckout}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              type="text"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              className="w-full p-2 border rounded-md"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Payment Details (Visible for Credit Card Only) */}
          {paymentMethod === "credit_card" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  name="cardNumber"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  maxLength="19"
                  onInput={handleCardNumberChange} // Add the handler here
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Month</label>
                  <input
                    name="expirationMonth"
                    type="number"
                    className="w-full p-2 border rounded-md"
                    max="12"
                    min="1"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    name="expirationYear"
                    type="number"
                    className="w-full p-2 border rounded-md"
                    max="34"
                    min="24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    name="cvv"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
