import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cancel Orders</h1>

      {/* Navigation Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => handleNavigation('/managesales/refund')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refund Orders
        </button>
        <button
          onClick={() => handleNavigation('/managesales/cancel')}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Orders
        </button>
        <button
          onClick={() => handleNavigation('/managesales/discount')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Discount
        </button>
        <button
          onClick={() => handleNavigation('/managesales/changePrice')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Change Price
        </button>
        <button
          onClick={() => handleNavigation('/managesales/productsRevenue')}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Products & Revenue
        </button>
      </div>

      {/* Add cancel order logic here */}
    </div>
  );
};

export default CancelPage;
