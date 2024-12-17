import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderedProducts = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Eğer token yoksa, login sayfasına yönlendir
          return;
        }

        const response = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data); // Siparişleri state'e ekle
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders"); // Hata mesajı göster
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };

    fetchOrders(); // Component mount olduğunda siparişleri al
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ordered Products</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.user?.username || "Unknown"}</td>
                <td className="border border-gray-300 px-4 py-2">{order.totalAmount} ₺</td>
                <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.paymentDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderedProducts;
