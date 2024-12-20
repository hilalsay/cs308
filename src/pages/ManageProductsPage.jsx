import React, { useEffect, useState } from "react";
import CategoryPage from "./CategoryPage";
// You can later implement ProductList component for product management
// import ProductList from "./ProductList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ManageReviewsPage from "./ManageReviewsPage";
import ManageOrdersPage from "./ManageOrdersPage";
import ProductManager from "./ProductManager";

const ManageProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("categories"); // State to switch between views
  const [userRole, setUserRole] = useState(null); // State to store the user's role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
          },
        });
        setUserRole(response.data.role); // Set the user's role
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        navigate("/login"); // Redirect to login if fetching profile fails
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Redirect to login page if user is not a ProductManager
  useEffect(() => {
    if (userRole && userRole != "ProductManager") {
      setUserRole(null); // Set the userRole to null to render an empty div
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === "ProductManager") {
      const fetchCategories = async () => {
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data);
      };

      const fetchProducts = async () => {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      };

      fetchCategories();
      fetchProducts();
    }
  }, [userRole]);

  if (userRole !== "ProductManager") {
    return <div>You don't have authority to see this page!</div>; // Return empty div if the user is not a ProductManager
  }

  return (
    <div className="manage-products-page max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Manage Products
      </h1>

      {/* Navbar */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={() => setView("categories")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            view === "categories" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setView("products")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            view === "products" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setView("delivery")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            view === "delivery" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Delivery
        </button>
        <button
          onClick={() => setView("comments")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            view === "comments" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Comments
        </button>
      </div>

      {/* Conditional Rendering for Categories, Products, Delivery, or Comments */}
      {view === "categories" ? (
        <CategoryPage categories={categories} setCategories={setCategories} />
      ) : view === "products" ? (
        <div className="product-management">
          <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
          {/* Product Management content goes here */}
          <ProductManager></ProductManager>
        </div>
      ) : view === "delivery" ? (
        <div className="delivery-management">
          <h2 className="text-2xl font-semibold mb-4">Manage Delivery</h2>
          {/* Delivery management content goes here */}
          <ManageOrdersPage></ManageOrdersPage>
        </div>
      ) : (
        <div className="comments-management">
          <h2 className="text-2xl font-semibold mb-4">Manage Comments</h2>
          {/* Comment handling content goes here */}
          <ManageReviewsPage></ManageReviewsPage>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
