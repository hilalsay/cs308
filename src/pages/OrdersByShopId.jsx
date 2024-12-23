import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersByShopId = ({ shopId }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Fetch the shopping cart by shopId (no authentication needed)
        const response = await axios.get(
          `http://localhost:8080/api/cart/products/${shopId}`
        );
        if (response.data && response.data.items) {
          setCart(response.data); // Set the shopping cart data
        } else {
          setError("Cart data is invalid.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shopping cart:", err);
        setError("Failed to fetch shopping cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, [shopId]);

  const generateInvoice = async () => {
    try {
      // Get token from localStorage (or wherever you store it)
      const token = localStorage.getItem("authToken"); // Replace this with your token retrieval method

      // If token exists, include it in the Authorization header
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        responseType: "arraybuffer", // To handle the PDF binary data
      };

      const response = await axios.get(
        `http://localhost:8080/api/invoice/${shopId}`,
        config
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open PDF in a new tab
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Error generating invoice:", err);
      setError("Failed to generate invoice");
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p>No products found for this order.</p>;
  }

  return (
    <div>
      <div className="cart-summary">
        <p>
          <strong>Total:</strong> ${cart.total?.toFixed(2)}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(cart.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="product-list">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="product-item mb-4 p-4 border rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <div>
                <p>
                  <strong>{item.product.name}</strong>
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product.price?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generateInvoice} className="btn btn-primary mt-4">
        Generate Invoice
      </button>
    </div>
  );
};

export default OrdersByShopId;
