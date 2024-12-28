import React, { useEffect, useState,useContext } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Navbar_manager = () => {
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
          setUserRole(response.data.role); // Set the user role from the profile response
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserRole(null); // Handle error if fetching user profile fails
        }
      };
      fetchUserProfile();
    }
  }, [token]);

  if (userRole !== "SALES_MANAGER") {
    return null; // Do not render the navbar if the role is not SALES_MANAGER
  }

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (

    <div className="flex flex-col justify-center items-center  py-0 font medium">
          <ul className="hidden justify-center sm:flex gap-8 text-lg text-gray-1000">
            <NavLink to="/managesales/refund" className="flex flex-col items-center gap-1">
              <p>Refund</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
    
            <NavLink to="/managesales/changePrice" className="flex flex-col items-center gap-1">
              <p>Price & Discound</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
            <NavLink to="/managesales/productsRevenue" className="flex flex-col items-center gap-1">
              <p>Products & Revenue</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
            
          </ul>
    
          <hr className="w-full mt-3 px-10 py-0 border-none h-[1.5px] bg-gray-200" />
        </div>

  );
};

export default Navbar_manager;
