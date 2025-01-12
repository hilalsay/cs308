import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Revenue from "./Revenue";

const ProductsRevenuePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(""); // Default start date
  const [endDate, setEndDate] = useState(""); // Default end date
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort orders in reverse chronological order (newest first)
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders); // Initially, display all orders
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filter orders based on selected start and end dates
  useEffect(() => {
    const minDate = new Date(-8640000000000000); // Default: Minimum date
    const maxDate = new Date(8640000000000000); // Default: Maximum date

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
      const start = startDate
        ? new Date(startDate).setHours(0, 0, 0, 0)
        : minDate;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : maxDate;

      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);

  // Handle downloading the invoice for an order
  const handleDownloadInvoice = async (order) => {
    try {
      const response = await axios.get(`/api/invoice/${order.id}`, {
        responseType: "blob",
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

  // Display loading or error message if applicable
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Orders & Revenue</h1>

      <div className="mb-6">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 border border-gray-300"
        />
        <label className="mr-2 ml-4">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 border border-gray-300"
        />
      </div>
      <Revenue startDate={startDate} endDate={endDate} />
      <h2 className="text-xl font-bold mb-4">Orders Chart</h2>
      {filteredOrders.length === 0 ? (
        <p>No orders found for the selected date range.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">
                Customer Name
              </th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Order Status</th>
              <th className="border border-gray-300 px-4 py-2">
                Payment Method
              </th>
              <th className="border border-gray-300 px-4 py-2">Payment Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.user?.username || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.orderAddress || "Not Provided"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.totalAmount} $
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.orderStatus}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.paymentMethod}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.paymentDate).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsRevenuePage;
