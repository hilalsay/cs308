import React, { useState } from "react";

const CategoryPage = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const handleAddCategory = async () => {
    const response = await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    const data = await response.json();
    setCategories([...categories, data]);
    setNewCategory({ name: "", description: "" });
  };

  const handleDeleteCategory = async (categoryId) => {
    const response = await fetch(`/api/category/${categoryId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } else {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="category-page max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Categories
      </h2>

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
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Add Category
        </button>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Existing Categories
      </h3>
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
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
