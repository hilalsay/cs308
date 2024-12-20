import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    description: "",
    stockQuantity: "",
    price: -1, // Default value for price
    warrantyStatus: "",
    distributorInformation: "",
    categoryId: "",
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append(
      "product",
      JSON.stringify({
        name: formData.name,
        model: formData.model,
        serialNumber: formData.serialNumber,
        description: formData.description,
        stockQuantity: formData.stockQuantity,
        price: editingProductId ? formData.price : -1, // Default price on add
        warrantyStatus: formData.warrantyStatus,
        distributorInformation: formData.distributorInformation,
        category: { id: formData.categoryId },
      })
    );
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingProductId) {
        await axios.put(
          `http://localhost:8080/api/products/${editingProductId}`,
          data
        );
        alert("Product updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/products", data);
        alert("Product added successfully");
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || "",
      model: product.model || "",
      serialNumber: product.serialNumber || "",
      description: product.description || "",
      stockQuantity: product.stockQuantity || "",
      price: product.price || -1, // Keep existing price during edit
      warrantyStatus: product.warrantyStatus || "",
      distributorInformation: product.distributorInformation || "",
      categoryId: product.category?.id || "",
      image: null,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      serialNumber: "",
      description: "",
      stockQuantity: "",
      price: -1,
      warrantyStatus: "",
      distributorInformation: "",
      categoryId: "",
      image: null,
    });
    setEditingProductId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">Product Manager</h1>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number"
            value={formData.serialNumber}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          {/* Price Field: Displayed only when editing */}
          {editingProductId && (
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              readOnly
              className="input-field bg-gray-100"
            />
          )}
          <input
            type="text"
            name="warrantyStatus"
            placeholder="Warranty Status"
            value={formData.warrantyStatus}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          <input
            type="text"
            name="distributorInformation"
            placeholder="Distributor Info"
            value={formData.distributorInformation}
            onChange={handleInputChange}
            required
            className="input-field"
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="input-field"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="input-field"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-700">Model: {product.model}</p>
            <p className="text-gray-700">Price: ${product.price}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
