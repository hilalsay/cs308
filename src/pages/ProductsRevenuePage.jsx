import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

const ProductsRevenuePage = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(null); // State for error handling
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const response = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data); // Store the orders in the state
        setFilteredOrders(response.data); // Set filtered orders initially to all orders
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders"); // Set error message
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchOrders(); // Fetch orders on component mount
  }, [navigate]);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        if (isNaN(orderDate.getTime())) {
            return false; // Skip invalid date
        } else if (orderDate >= new Date(startDate) && orderDate <= new Date(endDate)) {
            return true;
        } else {
            return false;
        }
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // If no date range is selected, show all orders
    }
  }, [startDate, endDate, orders]);

  if (loading) {
    return <div>Loading...</div>; // Show spinner while loading
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message
  }

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoice for Order ID: ' + order.id, 10, 10);
  
    // Check and format the date properly
    const orderDate = new Date(order.createdAt); // 'createdAt' field from order
    const formattedDate = isNaN(orderDate) ? "Invalid Date" : orderDate.toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 10, 20);
  
    // Handle customer name and address
    const customerName = order.ordererName || "No name";  // 'ordererName' from order
    doc.text(`Customer Name: ${customerName}`, 10, 30);
  
    const shippingAddress = order.orderAddress || "Not provided"; // 'orderAddress' from order
    doc.text(`Shipping Address: ${shippingAddress}`, 10, 40);
  
    let yPosition = 50;
  
    // Assuming 'order.items' is available, if not, show message
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach((item, index) => {
        const productName = item.product?.name || "Unknown Product";
        const quantity = item.quantity || 0;
        const price = item.price || 0.00;
        doc.text(`${index + 1}. ${productName} - Quantity: ${quantity} - Price: $${price}`, 10, yPosition);
        yPosition += 10;
      });
    } else {
      doc.text("No items found for this order.", 10, yPosition);
    }
  
    // Handle total amount and payment method
    const totalAmount = order.totalAmount || 0.00; // 'totalAmount' from order
    const paymentMethod = order.paymentMethod || "Not provided"; // 'paymentMethod' from order
    doc.text(`Total: $${totalAmount}`, 10, yPosition + 10);
    doc.text(`Payment Method: ${paymentMethod}`, 10, yPosition + 20);
  
    // Generate and download the PDF
    doc.save(`Invoice_Order_${order.id}.pdf`);
  };  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Products & Revenue</h1>

      {/* Navigation Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => navigate("/managesales/refund")} // Navigate to Refund Orders page
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refund Orders
        </button>
        <button
          onClick={() => navigate("/managesales/discount")} // Navigate to Apply Discount page
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Discount
        </button>
        <button
          onClick={() => navigate("/managesales/changePrice")} // Navigate to Change Price page
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Change Price
        </button>
        <button
          onClick={() => navigate("/managesales/productsRevenue")} // Navigate to View Products & Revenue page
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Products & Revenue
        </button>
      </div>

      {/* Orders Table */}
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
                <td className="border border-gray-300 px-4 py-2">{order.user?.username || "Unknown"}</td>
                <td className="border border-gray-300 px-4 py-2">{order.totalAmount} ₺</td>
                <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.paymentDate).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => generateInvoice(order)}
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
