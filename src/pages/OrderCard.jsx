import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderCard = ({ order }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          console.error("No token found");
          return;
        }

        console.log("Fetching products for shop_id:", order?.shop_id);

        const response = await axios.get(
          `http://localhost:8080/api/cart/infoProducts/${order?.shop_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched products:", response.data);
        setProducts(response.data || []);
      } catch (err) {
        console.error(
          "Error fetching order products:",
          err.response || err.message
        );
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (order?.shop_id) {
      fetchOrderProducts();
    }
  }, [order?.shop_id]);

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
            <div
              key={product.id}
              className="product product-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={
                  `data:image/jpeg;base64,${product.imageData}` ||
                  "/placeholder.png"
                } // Default placeholder image
                alt={product.name || "Product"}
                className="product-image"
              />
              <div className="product-details">
                <p>{product.name || "Unknown"}</p>
                <p>Quantity: {product.quantity || 0}</p>
                <p>Price: ${product.price?.toFixed(2) || "N/A"}</p>
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
