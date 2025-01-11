import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const RefundPage = () => {
  const { token, logout } = useContext(AuthContext);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch refund requests
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchRefundRequests();
    }
  }, [token]);

  const fetchRefundRequests = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:8080/api/refunds", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the JWT token
        },
      });
      console.log("Fetched refund requests:", response.data); // Check the response
      setRefundRequests(response.data);
    } catch (err) {
      console.error("Error fetching refund requests:", err);
      setError("Error fetching refund requests.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Approve refund request
  const approveRefund = async (refundRequestId) => {
    const token = localStorage.getItem("token");
    const managerId = "manager-id"; // Replace with actual manager ID
    console.log("Using token:", token); // Log token to verify it's correct
    try {
      const response = await axios.put(
        `http://localhost:8080/api/refunds/${refundRequestId}/approve`,
        null,
        {
          params: { managerId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Refund approved:", response.data);
      fetchRefundRequests(); // Reload the refund requests after approving
    } catch (err) {
      console.error("Error approving refund:", err);
      if (err.response) {
        console.error("Response Error:", err.response.data); // Log error details
      }
      setError("Error approving refund.");
    }
  };
  

  // Reject refund request
  const rejectRefund = async (refundRequestId) => {
    const managerId = "manager-id"; // Replace with actual manager ID (could come from context or user data)
    try {
      const response = await axios.put(
        `http://localhost:8080/api/refunds/${refundRequestId}/reject`,
        null,
        {
          params: { managerId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Refund rejected:", response.data);
      fetchRefundRequests(); // Reload the refund requests after rejecting
    } catch (err) {
      console.error("Error rejecting refund:", err);
      setError("Error rejecting refund.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Refund Management</h1>

      {loading ? (
        <p>Loading refund requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : refundRequests.length > 0 ? (
        <ul className="space-y-4">
          {refundRequests.map((request) => (
            <li
              key={request.id}
              className="border border-gray-300 p-4 rounded-md shadow-sm"
            >
              <p>
                <strong>Order ID:</strong> {request.order.id}
              </p>
              <p>
                <strong>Product ID:</strong> {request.product.id}
              </p>
              <p>
                <strong>Product Name:</strong> {request.product.name}
              </p>
              <p>
                <strong>Product Serial Number:</strong> {request.product.serialNumber}
              </p>
              <p>
                <strong>Buyer Name:</strong> {request.order.user.username}
              </p>
              <p>
                <strong>Status:</strong> {request.status || "Pending"}
              </p>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => approveRefund(request.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectRefund(request.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No refund requests found.</p>
      )}
    </div>
  );
};

export default RefundPage;
