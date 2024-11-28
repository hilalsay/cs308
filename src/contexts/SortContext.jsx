
import React, { createContext, useState, useContext } from "react";

const SortContext = createContext();

export const useSort = () => {
  return useContext(SortContext);
};

export const SortProvider = ({ children }) => {
  const [sortBy, setSortBy] = useState("popularity"); // Default sort option

  return (
    <SortContext.Provider value={{ sortBy, setSortBy }}>
      {children}
    </SortContext.Provider>
  );
};
