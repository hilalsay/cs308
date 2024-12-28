import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

const ChangePricePage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    description: "",
    price: "", // Editable for Sales Manager
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




  const updateProductPriceAndDiscount = async (productId, newPrice, discountRate) => {

    console.log("editing product: ",newPrice," ", discountRate);
    if(newPrice !== null && newPrice !== undefined && discountRate !== null && discountRate !== undefined){
      try {
        // Send both requests concurrently
        const [priceResponse, discountResponse] = await Promise.all([
          axios.put(
            `http://localhost:8080/api/products/${productId}/price`,
            null, // No body for price update
            { params: { newPrice: newPrice } }
          ),
          axios.put(
            `http://localhost:8080/api/products/${productId}/discount`,
            null, // No body for discount update
            { params: { discountRate: discountRate } }
          ),
        ]);
    
        console.log("Price updated successfully:", priceResponse.data);
        console.log("Discount updated successfully:", discountResponse.data);
        return {
          priceResponse: priceResponse.data,
          discountResponse: discountResponse.data,
        };
      } catch (error) {
        if (error.response) {
          console.error("Error updating product:", error.response.data);
        } else {
          console.error("Error updating product:", error.message);
        }
        throw error; // Rethrow to handle errors in calling code
      }
    } else {
      console.log("input null")
      alert("Product input empty.");
    }
    
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProductId) {
      alert("Please select a product to edit.");
      return;
    }
  
    try {
      const updatedData = await updateProductPriceAndDiscount(
        editingProductId,
        formData.price,
        formData.discountRate
      );
      //alert("Product updated successfully.");
      console.log("Updated data:", updatedData);
      fetchProducts(); // Refresh the product list
      resetForm(); // Clear the form
    } catch (error) {
      alert("Failed to update the product. Check the console for details.");
    }
  };
  



  const handleEdit = (product) => {
    
    setEditingProductId(product.id);
    setFormData({
      name: product.name || "",
      model: product.model || "",
      serialNumber: product.serialNumber || "",
      description: product.description || "",
      price: product.price || "",
      warrantyStatus: product.warrantyStatus || "",
      distributorInformation: product.distributorInformation || "",
      categoryId: product.category?.id || "",
      discountRate: product.discountRate !== null ? product.discountRate : "", // Handle null gracefully
    });
  };
  

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      serialNumber: "",
      description: "",
      price: "",
      warrantyStatus: "",
      distributorInformation: "",
      categoryId: "",
      discountRate: "",
    });
    setEditingProductId(null);
  };


  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Change Product Price</h1>

      <div className="max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">Sales Manager</h1>

      {/* Product Form */}
      {editingProductId && (
  <form
    onSubmit={handleSubmit }
    className="bg-white p-6 rounded-lg shadow-md mb-8"
    encType="multipart/form-data"
  >
    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        readOnly
        className="input-field  text-gray-600"
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={formData.model}
        readOnly
        className="input-field text-gray-600"
      />
      <input
        type="text"
        name="serialNumber"
        placeholder="Serial Number"
        value={formData.serialNumber}
        readOnly
        className="input-field text-gray-600"
      />
      <div>
        <p>
          price:
        </p>
        <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
        className="input-field"
      />
      </div>
      <input
        type="text"
        name="warrantyStatus"
        placeholder="Warranty Status"
        value={formData.warrantyStatus}
        readOnly
        className="input-field text-gray-600"
      />
      <input
        type="text"
        name="distributorInformation"
        placeholder="Distributor Info"
        value={formData.distributorInformation}
        readOnly
        className="input-field text-gray-600"
      />
      <input
        type="text"
        name="categoryId"
        value={
          categories.find((cat) => cat.id === formData.categoryId)?.name ||
          "No Category Selected"
        }
        readOnly
        className="input-field text-gray-600"
      />
      <div>
        <p>
          discount rate:
        </p>
        <input
          type="number"
          name="discountRate"
          placeholder="Discount Rate"
          value={formData.discountRate !== null ? formData.discountRate : ""} // Avoid showing 0 when null
          onChange={(e) => setFormData({ ...formData, discountRate: e.target.value })}
          className="input-field"
        />

      </div>
      
    </div>
    <button
      type="submit"
      className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600"
    >
      Update Product
    </button>
    <button
      type="button"
      onClick={resetForm}
      className="bg-gray-500 text-white px-6 py-2 rounded-lg mt-4 ml-2 hover:bg-gray-600"
    >
      Cancel
    </button>
  </form>
)}


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
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ChangePricePage;
