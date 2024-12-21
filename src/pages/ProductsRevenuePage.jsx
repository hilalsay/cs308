import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

const ProductsRevenuePage = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(null); // State for error handling
  const [activeView, setActiveView] = useState("default"); // State to track the active view
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
    // Log the startDate and endDate values to check them
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        // Log the original order.created_at value
        const orderDate = new Date(order.createdAt);  // Handle the date parsing properly

        console.log("Parsed Order Date:", orderDate);
    
        if (isNaN(orderDate.getTime())) {
            console.log(`Invalid date for Order ID: ${order.id}`);
            return false; // Skip invalid date
        } else if (orderDate >= new Date(startDate) && orderDate <= new Date(endDate)) {
            console.log(`Order ID: ${order.id} is in range.`);
            return true;
        } else {
            console.log(`Order ID: ${order.id} is not in range.`);
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

  // Invoice generation function
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoice for Order ID: ' + order.id, 10, 10);

    doc.setFontSize(12);
    doc.text(`Date: ${order.created_at}`, 10, 20);
    doc.text(`Customer Name: ${order.user.name}`, 10, 30);
    doc.text(`Shipping Address: ${order.shipping_address}`, 10, 40);

    let yPosition = 50;
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.product.name} - Quantity: ${item.quantity} - Price: $${item.price}`, 10, yPosition);
      yPosition += 10;
    });

    doc.text(`Total: $${order.total_amount}`, 10, yPosition + 10);
    doc.text(`Payment Method: ${order.payment_method}`, 10, yPosition + 20);

    doc.save(`Invoice_Order_${order.id}.pdf`);
  };

  // Handlers for switching views
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // Render the selected view
  const renderView = () => {
    switch (activeView) {
      case "refund":
        return <div>Refund functionality coming soon...</div>;
      case "cancel":
        return <div>Cancel functionality coming soon...</div>;
      case "discount":
        return <div>Discount functionality coming soon...</div>;
      case "changePrice":
        return <div>Change price functionality coming soon...</div>;
      case "productsRevenue":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Orders Table</h2>
            <div className="mb-4">
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
      default:
        return <div>Select an action to view the content.</div>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Sales</h1>

      {/* Navigation Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => handleViewChange("refund")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refund Orders
        </button>
        <button
          onClick={() => handleViewChange("cancel")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Orders
        </button>
        <button
          onClick={() => handleViewChange("discount")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Discount
        </button>
        <button
          onClick={() => handleViewChange("changePrice")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Change Price
        </button>
        <button
          onClick={() => handleViewChange("productsRevenue")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Products & Revenue
        </button>
      </div>

      {/* Dynamic View Content */}
      <div className="border-t border-gray-300 pt-4">{renderView()}</div>
    </div>
  );
};

export default ProductsRevenuePage;
