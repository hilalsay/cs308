import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/orders/user/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch orders: ${response.status} ${response.statusText}`
          );
        }

        const text = await response.text(); // Get the raw text response
        const data = text ? JSON.parse(text) : []; // Parse only if text is not empty
        setOrders(data);
        //console.log("orders: ",orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
