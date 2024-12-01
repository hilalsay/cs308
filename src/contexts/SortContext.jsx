import React, { createContext, useState, useContext } from "react";

const SortContext = createContext();

export const useSort = () => {
  return useContext(SortContext);
};

export const SortProvider = ({ children }) => {
  const [sortBy, setSortBy] = useState("popularity");
  const [sortedResults, setSortedResults] = useState([]);
  
  

  const sort = async (products, order) => {
    if (order === "popularity") {
      products.sort((a, b) => b.overallRating - a.overallRating);
      setSortedResults(products);
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
