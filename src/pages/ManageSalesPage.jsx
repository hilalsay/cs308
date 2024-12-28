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
      
    </div>
  );
};

export default ManageSalesPage;
