import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

/*If justify-between left everything aligned to the left with the right side empty, 
it usually indicates there was only one main "group" of items within that flex container. 
Since justify-between needs at least two elements to space apart, it doesn’t add any space if only one group is present. */

const Navbar_routes = () => {
  const [userRole, setUserRole] = useState(null); 
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    // Check if there is a token, meaning the user is logged in
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
    } else {
      setUserRole(null); // Ensure user role is reset when token is absent
    }
  }, [token]);

  // If the user is not logged in or does not have SALES_MANAGER role, return null (no navbar)
  if (userRole === "SALES_MANAGER" || userRole === "ProductManager") {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center  py-0 font medium">
      <ul className="hidden justify-center sm:flex gap-8 text-lg text-gray-1000">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Products</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/necklaces" className="flex flex-col items-center gap-1">
          <p>Necklaces</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/rings" className="flex flex-col items-center gap-1">
          <p>Rings</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/bracelets" className="flex flex-col items-center gap-1">
          <p>Bracelets</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/earrings" className="flex flex-col items-center gap-1">
          <p>Earrings</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <hr className="w-full mt-3 px-10 py-0 border-none h-[1.5px] bg-gray-200" />
    </div>
  );
};

export default Navbar_routes;
