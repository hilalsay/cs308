import React from "react";
import { useSort } from "../contexts/SortContext"; // Context'i kullan

const SortSelector = () => {
  const { sortBy, setSortBy } = useSort(); // Sıralama durumunu ve set metodunu al

  const handleChange = (event) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort); // Seçilen sıralama kriterini güncelle
  };

  return (
    <div className="mb-4">
      <label htmlFor="sortBy" className="mr-2">Sort By: </label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={handleChange}
        className="border rounded p-2"
      >
        <option value="popularity">Popularity</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortSelector;
