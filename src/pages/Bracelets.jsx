import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Products.css";

const Bracelets = () => {
    const [necklaceProducts, setNecklaceProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    // Fetch categories and filter for "Bracelets" products
    axios
    .get("http://localhost:8080/api/category")
    .then((response) => {
        const categories = response.data;

        // Find the "Bracelets" category and extract its products
        const BraceletsCategory = categories.find(
            (cat) => cat.name === "Bracelets"
        );

        // Set the necklace products if the category is found
        if (BraceletsCategory) {
            setNecklaceProducts(BraceletsCategory.products);
        } else {
            setError("Bracelets category not found");
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load products");
    })
    .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading Bracelets...</div>;
    if (error) return <div>{error}</div>;

    return (
    <div>
        <h2 className="collection-header">Bracelets Collection</h2>
            <div className="product-container">
                {necklaceProducts.length > 0 ? (
                necklaceProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
                ) : (
                <p>No Bracelets available.</p>
                )}
            </div>
    </div>
    );
};

export default Bracelets;