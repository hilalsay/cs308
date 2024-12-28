import React from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Refund Management</h1>

      

      {/* Add refund logic here */}
    </div>
  );
};

export default RefundPage;
