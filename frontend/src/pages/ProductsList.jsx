import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsList = () => {
  // State to store the fetched products
  const [products, setProducts] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // Fetch products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data); // Store products in state
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means it runs once when the component mounts

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id} style={{ marginBottom: "20px" }}>
              <h3>{product.name}</h3>
              <p>
                <strong>Model:</strong> {product.model}
              </p>
              <p>
                <strong>Serial Number:</strong> {product.serialNumber}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Stock Quantity:</strong> {product.stockQuantity}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Warranty Status:</strong> {product.warrantyStatus}
              </p>
              <p>
                <strong>Distributor:</strong> {product.distributorInformation}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {product.category || "No category assigned"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductsList;
