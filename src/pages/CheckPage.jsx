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
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border -t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

      </div>
    </div>
  );
};

export default CheckoutPage;
