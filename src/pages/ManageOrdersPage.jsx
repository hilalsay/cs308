import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderProductsList from "./OrderProductsList";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Current page
  const [size, setSize] = useState(10); // Records per page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  // Fetch orders with pagination
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/orders/paged",
          {
            params: { page, size },
          }
        );

        setOrders(response.data.content); // Set orders from paginated content
        setTotalPages(response.data.totalPages); // Set total pages from response
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, size]); // Re-fetch when page or size changes

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

  // Handle downloading the invoice for an order
  const handleDownloadInvoice = async (order) => {
    try {
      const response = await axios.get(`/api/invoice/${order.id}`, {
        responseType: "blob", // Expecting a binary response (PDF file)
      });

      if (response.status === 200) {
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;
        link.setAttribute("download", `invoice_${order.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error(
          "Failed to fetch invoice, unexpected response status:",
          response.status
        );
        alert("Failed to fetch invoice");
      }
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice");
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
                <strong>Orderer ID:</strong> {order.user.id}
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

              <div>
                <h4 className="font-semibold mt-4">Products:</h4>
                {order.shop_id && <OrderProductsList shopId={order.shop_id} />}
              </div>

              <div className="mt-2">
                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download Invoice
                </button>
              </div>

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

      {/* Pagination Controls */}
      <div className="pagination-controls mt-6 flex justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
