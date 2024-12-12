import React, { useState } from "react";

const ProductList = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  const handleAddProduct = async () => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data = await response.json();
    setProducts([...products, data]); // Add new product to the list
    setNewProduct({ name: "", price: "", categoryId: "" }); // Clear input fields
  };

  const handleDeleteProduct = async (productId) => {
    await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    setProducts(products.filter((product) => product.id !== productId)); // Remove deleted product
  };

  return (
    <div className="product-list">
      <h2>Products</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
      />
      <select
        value={newProduct.categoryId}
        onChange={(e) =>
          setNewProduct({ ...newProduct, categoryId: e.target.value })
        }
      >
        <option value="">Select Category</option>
        {/* Assuming categories are available */}
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddProduct}>Add Product</button>

      <h3>Existing Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
            <button onClick={() => handleDeleteProduct(product.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
