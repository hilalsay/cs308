import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Navbar_routes from "./components/Navbar_routes";
import ProductDetails from "./pages/ProductDetails"; // Import ProductDetail component
import Products from "./pages/Products"; // Import Product component
import { CartProvider } from "./contexts/CartContext"; // Import CartProvider
import ProductsList from "./pages/ProductsList"; // Import your products list
import { BrowserRouter as Router } from "react-router-dom";
import Necklaces from "./pages/Necklaces";
import Rings from "./pages/Rings";
import Bracelets from "./pages/Bracelets";
import Earrings from "./pages/Earrings";
import Checkout from "./pages/CheckPage";
import SearchResults from "./pages/SearchResults";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import AddProduct from "./pages/AddProduct";
import Invoice from "./pages/Invoice";
import { SortProvider } from "./contexts/SortContext";
import MyProfile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

const App = () => {
  return (
    <SortProvider>
      <SearchProvider>
        <AuthProvider>
          <CartProvider>
            {" "}
            {/* Wrap the entire app with CartProvider */}
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Navbar />
              <Navbar_routes />

              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
              />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route
                  path="/product/:productId"
                  element={<ProductDetails />}
                />
                <Route path="/necklaces" element={<Necklaces />} />
                <Route path="/rings" element={<Rings />} />
                <Route path="/bracelets" element={<Bracelets />} />
                <Route path="/earrings" element={<Earrings />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                {/* Updated route for product details */}
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </SearchProvider>
    </SortProvider>
  );
};

export default App;
