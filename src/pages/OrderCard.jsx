import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderCard = ({ order }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products for the given order using shop_id
  useEffect(() => {
    const fetchOrderProducts = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("authToken");

        // Check if the token exists
        if (!token) {
          console.error("No token found. Please log in.");
          setError("No token found.");
          return;
        }

        // Send the request to fetch products using the shop_id
        const response = await axios.get(
          `http://localhost:8080/api/orders/${order?.shop_id}/products`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the products state with the fetched data
        setProducts(response.data.products || []); // Adjust field as per the actual response
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order products:", err);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    if (order?.shop_id) {
      fetchOrderProducts();
    }
  }, [order?.shop_id]);

  // Format the date
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "Unknown";
  const totalPrice = order?.totalAmount ? order.totalAmount.toFixed(2) : "0.00";
  const status = order?.orderStatus || "Unknown";

  return (
    <div className="order-card">
      <h3>Order ID: {order?.shop_id || "N/A"}</h3>
      <p>
        <strong>Date:</strong> {orderDate}
      </p>
      <p>
        <strong>Total Price:</strong> ${totalPrice}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>

      <h4>Products:</h4>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : products.length > 0 ? (
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="product">
              <img
                src={product.imageUrl || "placeholder.png"}
                alt={product.name || "Product"}
                className="product-image"
              />
              <div className="product-details">
                <p>{product.name || "Unknown"}</p>
                <p>Quantity: {product.quantity || 0}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products in this order</p>
      )}
    </div>
  );
};

export default OrderCard;
