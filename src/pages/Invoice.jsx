import React from "react";
import { useLocation } from "react-router-dom";

const Invoice = () => {
  const { state } = useLocation();
  const { userInfo, cartItems, totalPrice } = state || {};

  // Calculate total price in case it's missing
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0); // Use item.quantity for total
  };

  const calculatedTotalPrice = totalPrice || calculateTotal(cartItems);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <div className="border p-4 rounded-lg">
        {/* User Information */}
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p><strong>Name:</strong> {userInfo?.fullName || "N/A"}</p>
        <p><strong>Email:</strong> {userInfo?.email || "N/A"}</p>
        <p><strong>Address:</strong> {userInfo?.address || "N/A"}</p>

        {/* Order Summary */}
        <h2 className="text-xl font-semibold mt-4 mb-2">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.product.name}</span>
            <span>
              {item.quantity} x ${item.price.toFixed(2)}
            </span>
          </div>
        ))}

        {/* Total Price */}
        <div className="border-t mt-4 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>${calculatedTotalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
