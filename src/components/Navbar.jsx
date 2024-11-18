// Navbar.jsx
import React, { useState, useEffect,useContext  } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../contexts/AuthContext";// Import useAuth for authentication state
import { useCart } from "../contexts/CartContext";  // Correct for named export

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);
  //const { isLoggedIn, login, logout } = useAuth(); // Use authentication state
  const { cartItems } = useCart(); // Access cartItems from CartContext
  const [visible, setVisible] = useState(false);

  const cartCount = cartItems.reduce((count, item) => count + item.quantityInCart, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      console.log(`Searching for: ${searchQuery}`);
      // You can add actual search logic here
    }
  };


  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <p>ShopApp</p>

      <div className="flex">
        <div>


        </div>
        <img src={assets.search_icon} className="w-8 cursor-pointer" alt="Search Icon" />
      </div>
      
      <div className="flex items-center gap-6">
        {/* Profile Icon and Dropdown Menu */}
        <div className="group relative">
          <img className="w-10 cursor-pointer" src={assets.profile_icon} alt="Profile Icon" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {user ? (
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
                  <Link
                    to="/login"
                    state={{ activeButton: "signup" }} // Pass state for "Sign Up"
                    className="cursor-pointer hover:text-black"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    state={{ activeButton: "login" }} // Pass state for "Login"
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
