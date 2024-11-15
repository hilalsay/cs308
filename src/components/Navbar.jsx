// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../pages/AuthContext"; // Import useAuth for authentication state
import { useCart } from "../pages/CartContext";

const Navbar = () => {
  const { isLoggedIn, login, logout } = useAuth(); // Use authentication state
  const { cartItems } = useCart(); // Access cartItems from CartContext
  const [visible, setVisible] = useState(false);

  const cartCount = cartItems.reduce((count, item) => count + item.quantityInCart, 0);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <p>ShopApp</p>
      <img src={assets.search_icon} className="w-8 cursor-pointer" alt="Search Icon" />

      <div className="flex items-center gap-6">
        {/* Profile Icon and Dropdown Menu */}
        <div className="group relative">
          <img className="w-10 cursor-pointer" src={assets.profile_icon} alt="Profile Icon" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="cursor-pointer hover:text-black">
                    MyProfile
                  </Link>
                  <Link to="/orders" className="cursor-pointer hover:text-black">
                    Orders
                  </Link>
                  <p onClick={logout} className="cursor-pointer hover:text-black">
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <Link to="/signup" className="cursor-pointer hover:text-black">
                    Signup
                  </Link>
                  <Link to="/login" className="cursor-pointer hover:text-black" onClick={login}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img className="w-9 cursor-pointer" src={assets.cart_real} alt="Cart Icon" />
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
            <img className="h-14" src={assets.back_icon} alt="Back Icon" />
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
