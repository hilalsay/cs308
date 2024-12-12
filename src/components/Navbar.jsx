import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axios from "axios"; // Import axios for HTTP requests
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext"; // Import SearchContext hook
import shopAppLogo from "../assets/shopapp2.png";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const { cartItems, fetchCartFromDB } = useCart();
  const { setSearchResults } = useSearchContext(); // Use SearchContext for managing results
  const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery state
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((count, item) => {
    // Validate quantity before adding it to the total
    const quantity =
      item.quantity && !isNaN(item.quantity)
        ? Number(item.quantity) // Use item.quantity directly
        : 0; // Default to 0 if invalid
    return count + quantity;
  }, 0);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/products/search?keyword=${searchQuery}`
        );
        console.log("Search results in Navbar:", response.data);

        // Set the search results in the context
        setSearchResults(response.data);

        // Navigate to the search results page
        navigate("/search");
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const handleCartClick = async () => {
    if (token) {
      await fetchCartFromDB(); // Sync cart to the backend
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <div className="flex items-center gap-4">
        <img
          src={shopAppLogo}
          alt="ShopApp Logo"
          className="w-20 h-20 object-contain"
        />
        <p className="text-2xl font-bold">ShopApp</p>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center justify-between border border-gray-400 px-8 py-3 my-5 ms-3 rounded-full w-4/5 sm:w-3/4">
          <input
            className="flex-1 outline-none bg-inherit text-sm px-4 py-2"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img
            src={assets.search_icon}
            className="w-8 cursor-pointer ml-3"
            alt="Search Icon"
            onClick={handleSearchSubmit}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Profile Icon and Dropdown Menu */}
        <div className="group relative">
          <img
            className="w-10 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile Icon"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="cursor-pointer hover:text-black"
                  >
                    MyProfile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="cursor-pointer hover:text-black"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </Link>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    state={{ activeButton: "signup" }}
                    className="cursor-pointer hover:text-black"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    state={{ activeButton: "login" }}
                    className="cursor-pointer hover:text-black"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative" onClick={handleCartClick}>
          <img
            className="w-9 cursor-pointer"
            src={assets.cart_real}
            alt="Cart Icon"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {cartCount}
          </p>
        </Link>

        {/* Mobile Menu Toggle Icon */}
        <img
          onClick={() => setVisible(true)}
          className="w-9 cursor-pointer sm:hidden"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Products
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/necklaces"
          >
            Necklaces
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/rings"
          >
            Rings
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/bracelets"
          >
            Bracelets
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/earrings"
          >
            Earrings
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
