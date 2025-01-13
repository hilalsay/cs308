import React, { useState, useEffect } from "react";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State for categories
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false); // Loading state for adding categories
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // ID of the category being deleted
  const [pageLoading, setPageLoading] = useState(true); // State for initial page load

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setPageLoading(false); // Mark the page as loaded
      }
    };

    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert("Both name and description are required.");
      return;
    }
    setAddLoading(true);
    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      const data = await response.json();
      setCategories([...categories, data]); // Add the new category to the list
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      alert(error.message);
    } finally {
      setAddLoading(false);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    setDeleteLoadingId(categoryId);
    try {
      const response = await fetch(`/api/category/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="category-page max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Categories
      </h2>

      {/* Add New Category Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Category Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          onClick={handleAddCategory}
          disabled={addLoading}
          className={`w-full p-3 ${
            addLoading ? "bg-gray-300" : "bg-blue-500"
          } text-white rounded-lg hover:bg-blue-600 focus:outline-none`}
        >
          {addLoading ? "Adding..." : "Add Category"}
        </button>
      </div>

      {/* Display Existing Categories */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Existing Categories
      </h3>
      {pageLoading ? (
        <p className="text-gray-600 text-center">Loading Categories...</p>
      ) : categories.length > 0 ? (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {category.name}
                </p>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                disabled={deleteLoadingId === category.id}
                className={`ml-4 ${
                  deleteLoadingId === category.id ? "bg-gray-300" : "bg-red-500"
                } text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none`}
              >
                {deleteLoadingId === category.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No categories available.</p>
      )}
    </div>
  );
};

export default CategoryPage;
