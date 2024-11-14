import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Rings = () => {
    const [necklaceProducts, setNecklaceProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    // Fetch categories and filter for "Rings" products
    axios
    .get("http://localhost:8080/api/category")
    .then((response) => {
        const categories = response.data;

        // Find the "Rings" category and extract its products
        const RingsCategory = categories.find(
            (cat) => cat.name === "Rings"
        );

        // Set the necklace products if the category is found
        if (RingsCategory) {
            setNecklaceProducts(RingsCategory.products);
        } else {
            setError("Rings category not found");
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load products");
    })
    .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading Rings...</div>;
    if (error) return <div>{error}</div>;

    return (
    <div>
        <h2 className="collection-header">Rings Collection</h2>
            <div className="product-container">
                {necklaceProducts.length > 0 ? (
                necklaceProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
                ) : (
                <p>No Rings available.</p>
                )}
            </div>
    </div>
    );
};

export default Rings;