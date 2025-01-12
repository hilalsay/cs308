import React, { useEffect, useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Navbar_ProductManager = () => {
  const [userRole, setUserRole] = useState(null); // State to track user role
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role); // Set the user role from the response
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserRole(null); // Handle errors and reset role
        }
      };
      fetchUserProfile();
    } else {
      setUserRole(null); // Reset role when no token
    }
  }, [token]);

  // Render nothing if the user is not a Product Manager
  if (userRole !== "ProductManager") {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="flex flex-col justify-center items-center py-0 font-medium">
      <ul className="hidden sm:flex justify-center gap-8 text-lg text-gray-1000">
        <NavLink
          to="/manageproducts/categories"
          className="flex flex-col items-center gap-1"
        >
          <p>Categories</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink
          to="/manageproducts/products"
          className="flex flex-col items-center gap-1"
        >
          <p>Products</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink
          to="/manageproducts/delivery"
          className="flex flex-col items-center gap-1"
        >
          <p>Delivery</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink
          to="/manageproducts/comments"
          className="flex flex-col items-center gap-1"
        >
          <p>Comments</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <hr className="w-full mt-3 px-10 py-0 border-none h-[1.5px] bg-gray-200" />
    </div>
  );
};

export default Navbar_ProductManager;
