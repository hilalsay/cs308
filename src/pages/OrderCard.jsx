import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewCard from "./ReviewCard";

const OrderCard = ({ order, onOrderStatusChange }) => {  // Add onOrderStatusChange prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [canCancel, setCanCancel] = useState(false);
  const [canRefund, setCanRefund] = useState(false);
  const [localOrderStatus, setLocalOrderStatus] = useState(order?.orderStatus);
  const [refundStatuses, setRefundStatuses] = useState({});

  useEffect(() => {
    // Update local status when order prop changes
    setLocalOrderStatus(order?.orderStatus);
  }, [order?.orderStatus]);

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
        
        // Fetch refund status for each product
        if (response.data && response.data.length > 0) {
          const statuses = {};
          for (const product of response.data) {
            try {
              const refundStatus = await axios.get(
                `http://localhost:8080/api/refunds/status`,
                {
                  params: {
                    orderId: order.id,
                    productId: product.product?.id
                  },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                }
              );
              statuses[product.product?.id] = refundStatus.data;
            } catch (err) {
              console.error("Error fetching refund status:", err);
              statuses[product.product?.id] = "ERROR";
            }
          }
          setRefundStatuses(statuses);
        }

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

    // Update cancel and refund buttons based on localOrderStatus
    if (localOrderStatus === 'PROCESSING') {
      setCanCancel(true);
    } else {
      setCanCancel(false);
    }

    const lessThanMonthOld = isLessThanMonthOld(order?.createdAt);

    if (localOrderStatus === 'DELIVERED' && lessThanMonthOld <= 30) {
      setCanRefund(true);
    } else {
      setCanRefund(false);
    }

  }, [order?.shop_id, token, localOrderStatus, order?.createdAt, order?.id]);

  const isLessThanMonthOld = (orderDate) => {
    const orderDateObject = new Date(orderDate);
    const currentDate = new Date();
    const diffInDays = (currentDate - orderDateObject) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  };

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

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update both local state and parent component
      const newStatus = "CANCELED";
      setLocalOrderStatus(newStatus);
      if (onOrderStatusChange) {
        onOrderStatusChange(orderId, newStatus);
      }
      
      alert("Order canceled successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error canceling order:", error.response.data);
        alert(`Error: ${error.response.data}`);
      } else {
        console.error("Error canceling order:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    if (canCancel && order?.id) {
      cancelOrder(order.id);
    }
  };

  const requestRefund = async (orderId, productId) => {
    try {
      if (!token) {
        alert("You must be logged in to request a refund.");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:8080/api/refunds/request?orderId=${orderId}&productId=${productId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setRefundStatuses(prev => ({
        ...prev,
        [productId]: "PENDING"
      }));
  
      alert("Refund request submitted successfully!");
    } catch (error) {
      console.error("Error requesting refund:", error.response?.data || error.message);
      alert(`Failed to request refund: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRefundRequest = async (orderId, productId) => {
    if (!isLessThanMonthOld(order?.createdAt)) {
      alert("Refund requests are only allowed within 30 days of delivery.");
      return;
    }
  
    try {
      await requestRefund(orderId, productId);
      console.log("Refund request submitted successfully.");
    } catch (error) {
      console.error("Refund request failed:", error);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h3>Order ID: {order?.id || "N/A"}</h3>
          <p>
            <strong>Date:</strong> {orderDate}
          </p>
          <p>
            <strong>Total Price:</strong> ${totalPrice}
          </p>
          <p>
            <strong>Status:</strong> {localOrderStatus || "Unknown"}
          </p>
        </div>

        {canCancel && (
          <div>
            <button
              onClick={handleCancel}
              disabled={!canCancel}
              style={{
                padding: "8px 16px",
                border: "none",
                backgroundColor: canCancel ? "#007BFF" : "#ccc",
                color: "#fff",
                borderRadius: "4px",
                cursor: canCancel ? "pointer" : "not-allowed",
              }}
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>

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
                  {refundStatuses[product.product?.id] && refundStatuses[product.product?.id] !== "NONE" && (
                    <p>Refund Status: {refundStatuses[product.product?.id]}</p>
                  )}
                </div>
              </div>

              {canRefund && 
               isLessThanMonthOld(order?.createdAt) && 
               (!refundStatuses[product.product?.id] || refundStatuses[product.product?.id] === "NONE") && (
                <button
                  onClick={() => handleRefundRequest(order?.id, product.product?.id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Request Refund
                </button>
              )}

              <ReviewCard
                productId={product.product?.id}
                orderId={order?.id}
                orderStatus={localOrderStatus}
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