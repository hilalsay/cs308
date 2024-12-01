import React, { createContext, useState, useContext } from "react";

const SortContext = createContext();

export const useSort = () => {
  return useContext(SortContext);
};

export const SortProvider = ({ children }) => {
  const [sortBy, setSortBy] = useState("popularity");
  const [sortedResults, setSortedResults] = useState([]);
  
  const fetchPopularityScores = async (products) => {
    const response = await axios.get(`http://localhost:8080/api/reviews/product/${productId}/popularity-score`);
    const popularityData = await response.json();

    // Map popularity scores to products
    const productMap = popularityData.reduce((map, item) => {
      map[item.id] = item.popularityScore;
      return map;
    }, {});

    return products.map(product => ({
      ...product,
      popularityScore: productMap[product.id] || 0 // Default to 0 if no score
    }));
  };

  const sort = async (products, order) => {
    if (order === "popularity") {
      const productsWithScores = await fetchPopularityScores(products);
      productsWithScores.sort((a, b) => b.popularityScore - a.popularityScore);
      setSortedResults(productsWithScores);
    } else if (order === "lowToHigh") {
      products.sort((a, b) => a.price - b.price);
      setSortedResults(products);
    } else if (order === "highToLow") {
      products.sort((a, b) => b.price - a.price);
      setSortedResults(products);
    }
  };

  return (
    <SortContext.Provider value={{ sortBy, setSortBy, sort, sortedResults }}>
      {children}
    </SortContext.Provider>
  );
};
