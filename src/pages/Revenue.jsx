import React, { useState, useEffect } from "react";
import axios from "axios";
import RevenueBarChart from "./RevenueBarChart";
const Revenue = ({ startDate, endDate }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch revenue data from the backend API
        const response = await axios.get(
          "http://localhost:8080/api/revenue/total"
        );

        setRevenueData(response.data);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to fetch revenue data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div>Loading revenue data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (revenueData.length === 0) {
    return <div>No revenue data available.</div>;
  }

  return (
    <div className="mt-6">
      <RevenueBarChart
        data={revenueData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default Revenue;
