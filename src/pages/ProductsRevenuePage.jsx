import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import OrdersByShopId from "./OrdersByShopId"; // Import the OrdersByShopId component

const ProductsRevenuePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // To hold the selected shop_id
  const [showProducts, setShowProducts] = useState(null); // Track which order's products to show
  const navigate = useNavigate();

  // Fetch orders on component mount
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
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filter orders by date range
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
 

  // Set the selected order's shop_id
  const handleLoadProducts = (orderId) => {
    setShowProducts((prevOrderId) => (prevOrderId === orderId ? null : orderId)); // Toggle product visibility
  };

  // Generate PDF invoice for an order
  const generateInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 10, 10);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 10, 20);
    doc.text(`Orderer Name: ${order.ordererName || "N/A"}`, 10, 30);
    doc.text(`Order Address: ${order.orderAddress || "N/A"}`, 10, 40);
    doc.text(`Status: ${order.orderStatus || "N/A"}`, 10, 50);
    doc.text(`Total Amount: $${order.totalAmount.toFixed(2)}`, 10, 60);
    doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 10, 70);
    doc.text(
      `Payment Date: ${
        order.paymentDate
          ? new Date(order.paymentDate).toLocaleString()
          : "N/A"
      }`,
      10,
      80
    );
    doc.text(
      `Created At: ${
        order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"
      }`,
      10,
      90
    );

    let yPosition = 100;
    if (order.items && order.items.length > 0) {
      doc.text("Order Items:", 10, yPosition);
      yPosition += 10;

      order.items.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.product.name} - ${item.quantity} x $${item.product.price}`,
          10,
          yPosition
        );
        yPosition += 10;
      });
    } else {
      doc.text("No items in this order.", 10, yPosition);
      yPosition += 10;
    }

    doc.save(`invoice_${order.id}.pdf`);
  };

  // If the page is loading, show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display the error message
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
              <th className="border border-gray-300 px-4 py-2">Products</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
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
                      onClick={() => handleLoadProducts(order.id)} // Toggle visibility of products for this order
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Load Products
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => generateInvoice(order)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Generate Invoice
                    </button>
                  </td>
                </tr>
                {/* Display products for the selected order */}
                {showProducts === order.id && order.items && (
                  <tr>
                    <td colSpan="8" className="border border-gray-300 px-4 py-2">
                      <h3 className="font-bold mb-2">Order Items:</h3>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product.name} - {item.quantity} x {item.product.price} ₺
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsRevenuePage;
