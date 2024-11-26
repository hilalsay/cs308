import React from "react";
import { useLocation } from "react-router-dom";

const Invoice = () => {
  const { state } = useLocation();
  const { userInfo, cartItems, totalPrice } = state || {};

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
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p><strong>Name:</strong> {userInfo.fullName}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Address:</strong> {userInfo.address}</p>
        <p>
          <strong>Card Number:</strong>{" "}
          {`**** **** **** ${userInfo.cardNumber.slice(-4)}`}
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name}</span>
            <span>
              {item.quantityInCart} x ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t mt-4 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
