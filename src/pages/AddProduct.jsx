import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    model: "",
    serialNumber: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    warrantyStatus: "",
    distributorInformation: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);

  // Handle input change for product details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file input change (image)
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("model", product.model);
    formData.append("serialNumber", product.serialNumber);
    formData.append("description", product.description);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("price", product.price);
    formData.append("warrantyStatus", product.warrantyStatus);
    formData.append("distributorInformation", product.distributorInformation);
    formData.append("category", product.category);

    if (image) {
      formData.append("imageFile", image); // Append the image file if selected
    }

    // Send POST request to backend with form data
    axios
      .post("http://localhost:8080/api/products", formData)
      .then((response) => {
        console.log("Product added:", response.data);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  return (
    <div className="container">
      <form className="product-form" onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Product Name"
            onChange={handleInputChange}
            value={product.name}
            name="name"
          />
        </div>
        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            placeholder="Product Model"
            onChange={handleInputChange}
            value={product.model}
            name="model"
          />
        </div>
        <div className="form-group">
          <label>Serial Number</label>
          <input
            type="text"
            placeholder="Serial Number"
            onChange={handleInputChange}
            value={product.serialNumber}
            name="serialNumber"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            onChange={handleInputChange}
            value={product.description}
            name="description"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            placeholder="Price"
            onChange={handleInputChange}
            value={product.price}
            name="price"
          />
        </div>
        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            placeholder="Stock Quantity"
            onChange={handleInputChange}
            value={product.stockQuantity}
            name="stockQuantity"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            onChange={handleInputChange}
            value={product.category}
            name="category"
          >
            <option value="">Select category</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Rings">Rings</option>
            <option value="Earrings">Earrings</option>
          </select>
        </div>
        <div className="form-group">
          <label>Warranty Status</label>
          <input
            type="text"
            placeholder="Warranty Status"
            onChange={handleInputChange}
            value={product.warrantyStatus}
            name="warrantyStatus"
          />
        </div>
        <div className="form-group">
          <label>Distributor Information</label>
          <input
            type="text"
            placeholder="Distributor Information"
            onChange={handleInputChange}
            value={product.distributorInformation}
            name="distributorInformation"
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
