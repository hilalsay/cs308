import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderProductsList = ({ shopId }) => {
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
        // Check if the response data contains valid cart structure
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
              <img
                src={`data:image/jpeg;base64,${item.product.imageData}`} // Assuming imageData is base64 encoded
                alt={item.product.name}
                className="w-20 h-20 object-cover mr-4"
              />
              <div>
                <p>
                  <strong>{item.product.name}</strong>
                  <p>Product ID: {item.product.id}</p>
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProductsList;
