import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { useSearchContext } from '../contexts/SearchContext'; // Import the context hook
import { useCart } from '../contexts/CartContext'; // Context for managing cart

const SearchResultsPage = () => {
  const { searchResults, searchQuery } = useSearchContext(); // Access search context values
  const { addToCart } = useCart(); // Access cart context values

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Search Results for "{searchQuery}"
      </h1>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        {searchResults.length > 0 ? (
          searchResults.map((result) => {
            // Define imageUrl based on result's imageData or use a placeholder
            const imageUrl = result.imageData
              ? `data:image/jpeg;base64,${result.imageData}`
              : "https://via.placeholder.com/150"; // Placeholder if no image

            return (
              <div
                key={result.id}
                className="min-w-[250px] max-w-[250px] bg-white shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                {/* Link to product page */}
                <Link to={`/product/${result.id}`}>
                  <img
                    className="w-full h-40 object-cover rounded-md mb-4"
                    src={imageUrl} // Use imageUrl here
                    alt={result.name}
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    {result.name}
                  </p>
                </Link>
                <p className="text-red-600 text-lg font-bold">${result.price}</p>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => addToCart(result)} // Add to cart functionality
                >
                  Add to Cart
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No results found for "{searchQuery}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
