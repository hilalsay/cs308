import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const SearchContext = createContext();

// Custom hook to use the context
export const useSearchContext = () => {
  return useContext(SearchContext);
};

// ShopProvider component to wrap your app with the context
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  // Log search results when they change
  useEffect(() => {
    console.log("Search Results Data context:", searchResults);
  }, [searchResults]);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};
