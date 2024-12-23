import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductsRevenuePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

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

        setOrders(response.data);
        setFilteredOrders(response.data); // Initially, display all orders
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
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) {
          return false;
        } else if (
          startDate === endDate &&
          orderDate.toDateString() === new Date(startDate).toDateString()
        ) {
          return true;
        } else if (orderDate >= new Date(startDate) && orderDate <= new Date(endDate)) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [startDate, endDate, orders]);


  // Handle downloading the invoice for an order
  const handleDownloadInvoice = async (order) => {
    try {
      const response = await axios.get(`/api/invoice/${order.id}`, {
        responseType: 'blob', // Expecting a binary response (PDF file)
      });
  
      if (response.status === 200) {
        // Create a link element
        const link = document.createElement('a');
        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;
        link.setAttribute('download', `invoice_${order.id}.pdf`); // Set the download file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link);
      } else {
        console.error('Failed to fetch invoice, unexpected response status:', response.status);
        alert('Failed to fetch invoice');
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice');
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
      <h1 className="text-2xl font-bold mb-6">View Products & Revenue</h1>

      <div className="mb-6 space-x-4">
        <button
          onClick={() => navigate("/managesales/refund")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refund Orders
        </button>
        <button
          onClick={() => navigate("/managesales/discount")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Discount
        </button>
        <button
          onClick={() => navigate("/managesales/changePrice")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Change Price
        </button>
        <button
          onClick={() => navigate("/managesales/productsRevenue")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Products & Revenue
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">View Products & Revenue</h1>

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

        {filteredOrders.length === 0 ? (
          <p>No orders found for the selected date range.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                <th className="border border-gray-300 px-4 py-2">Order Status</th>
                <th className="border border-gray-300 px-4 py-2">Payment Method</th>
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
                    {order.totalAmount} ₺
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(order.paymentDate).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDownloadInvoice(order)} // Button to download invoice
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
    </div>
  );
};

export default ProductsRevenuePage;
