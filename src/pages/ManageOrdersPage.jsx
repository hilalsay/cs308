import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderProductsList from "./OrderProductsList";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update to "in-transit"
  const handleInTransit = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/simulate-transit`
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "IN_TRANSIT" } : order
        )
      );
    } catch (err) {
      console.error("Error updating status to in-transit:", err);
    }
  };

  // Handle status update to "delivered"
  const handleDelivered = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/simulate-delivery`
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "DELIVERED" } : order
        )
      );
    } catch (err) {
      console.error("Error updating status to delivered:", err);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="manage-orders-page max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Manage Orders</h1>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="order-card mb-4 p-4 border rounded-lg shadow-md"
            >
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Orderer Name:</strong> {order.ordererName}
              </p>
              <p>
                <strong>Order Address:</strong> {order.orderAddress}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {new Date(order.paymentDate).toLocaleString()}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Fetch and display products for this order */}
              <div>
                <h4 className="font-semibold mt-4">Products:</h4>
                {order.shop_id && <OrderProductsList shopId={order.shop_id} />}
              </div>

              {/* Handle updating order status */}
              <div className="mt-4 flex justify-end space-x-4">
                {order.orderStatus === "PENDING" ||
                  (order.orderStatus === "PROCESSING" && (
                    <button
                      onClick={() => handleInTransit(order.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                      Mark as In-Transit
                    </button>
                  ))}

                {order.orderStatus === "IN_TRANSIT" && (
                  <button
                    onClick={() => handleDelivered(order.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Mark as Delivered
                  </button>
                )}

                {order.orderStatus === "DELIVERED" && (
                  <p className="text-green-500">Order Delivered</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrdersPage;
