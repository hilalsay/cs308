import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const RevenueBarChart = ({ data, startDate, endDate }) => {
  // Filter and sort data based on the date range
  const filteredData = data
    .filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate
        ? new Date(startDate)
        : new Date(-8640000000000000); // Default: Minimum date
      const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Default: Maximum date
      return itemDate >= start && itemDate <= end;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

  // Prepare chart data
  const chartData = {
    labels: filteredData.map((item) =>
      new Date(item.date).toLocaleDateString("en-US")
    ),
    datasets: [
      {
        label: "Total Revenue ($)",
        data: filteredData.map((item) => item.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        type: "bar", // Bar chart for the bars
      },
      {
        label: "Revenue Trend Line",
        data: filteredData.map((item) => item.totalRevenue),
        borderColor: "rgba(255, 0, 0, 1)", // Red line
        borderWidth: 2,
        fill: false, // Don't fill the area under the line
        tension: 0.4, // Smoothing the line curve
        type: "line", // Line chart for the trend
      },
      {
        label: "Loss-Profit",
        data: filteredData.map((item) => item.totalRevenue * 0.5), // 50% of revenue
        borderColor: "rgba(0, 255, 0, 1)", // Green line
        borderWidth: 2,
        fill: false, // Don't fill the area under the line
        tension: 0.4, // Smoothing the line curve
        type: "line", // Line chart for the trend
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Dates",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Revenue and Profit/Loss Chart</h2>
      {filteredData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
};

export default RevenueBarChart;
