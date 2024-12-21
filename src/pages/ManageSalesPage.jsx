import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageSalesPage = () => {
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on page load
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    } else {
      setLoading(false); // If token exists, stop loading spinner
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show spinner while loading
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message
  }

  // Handlers for button clicks to navigate to specific pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Sales</h1>

      {/* Navigation Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => handleNavigation("/managesales/refund")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refund Orders
        </button>
        <button
          onClick={() => handleNavigation("/managesales/cancel")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Orders
        </button>
        <button
          onClick={() => handleNavigation("/managesales/discount")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Discount
        </button>
        <button
          onClick={() => handleNavigation("/managesales/changePrice")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Change Price
        </button>
        <button
          onClick={() => handleNavigation("/managesales/productsRevenue")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Products & Revenue
        </button>
      </div>
    </div>
  );
};

export default ManageSalesPage;
