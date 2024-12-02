import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewCard from "./ReviewCard";

const OrderCard = ({ order }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderProducts = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/cart/infoCartitem/${order?.shop_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching order products:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (order?.shop_id) {
      fetchOrderProducts();
    }
  }, [order?.shop_id, token]);

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";
  const totalPrice = order?.totalAmount ? order.totalAmount.toFixed(2) : "0.00";
  const status = order?.orderStatus || "Unknown";

  return (
    <div
      className="order-card"
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        margin: "16px 0",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3>Order ID: {order?.id || "N/A"}</h3>
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
        <div className="products" style={{ display: "grid", gap: "16px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`data:image/jpeg;base64,${product.product?.imageData}`}
                  alt={product.product?.name || "Product"}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ marginLeft: "16px", flexGrow: 1 }}>
                  <Link
                    to={`/product/${product.product?.id}`}
                    style={{ color: "#007BFF", textDecoration: "none" }}
                  >
                    <strong>{product.product?.name || "Unknown"}</strong>
                  </Link>
                  <p>Quantity: {product.quantity || 0}</p>
                  <p>Price: ${product.price?.toFixed(2) || "N/A"}</p>
                </div>
              </div>
              <ReviewCard
                productId={product.product?.id}
                orderId={order?.id} // Pass the orderId to the ReviewCard
                orderStatus={status} // Pass orderStatus to the ReviewCard
                token={token}
              />
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
