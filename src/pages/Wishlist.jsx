import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8080/api/wishlist/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setWishlist(response.data.products || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching wishlist");
          setLoading(false);
        });
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [token]);

  const addToWishlist = (product) => {
    axios
      .post(
        "http://localhost:8080/api/wishlist/me/add",
        { product },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("Item added to wishlist"); // Added console log for feedback
      })
      .catch(() => {
        setError("Error adding product to wishlist");
      });
  };

  const removeFromWishlist = (productId) => {
    axios
      .delete(`http://localhost:8080/api/wishlist/me/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setWishlist((prev) => prev.filter((product) => product.id !== productId));
      })
      .catch(() => {
        setError("Error removing product from wishlist");
      });
  };

  const clearWishlist = () => {
    axios
      .delete("http://localhost:8080/api/wishlist/me/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setWishlist([]);
      })
      .catch(() => {
        setError("Error clearing wishlist");
      });
  };

  if (loading) {
    return <div className="text-center py-10">Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="border-t pt-14 px-4 sm:px-8">
      <div className="text-4xl mb-5 text-center">
        <h1>Your Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <p className="text-center">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlist.map((product) => (
            <WishlistItem
              key={product.id}
              product={product}
              removeFromWishlist={removeFromWishlist}
            />
          ))}
          <div className="text-center">
            <button
              onClick={clearWishlist}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WishlistItem = ({ product, removeFromWishlist }) => {
  const imageUrl = product.imageData
    ? `data:image/jpeg;base64,${product.imageData}`
    : "https://via.placeholder.com/150";

  return (
    <div className="py-4 border-t border-b text-gray-700 grid grid-cols-[1fr_4fr_0.5fr] sm:grid-cols-[1fr_4fr_1fr] items-center gap-6">
      <img
        src={imageUrl}
        alt={product.name || "Product Image"}
        className="w-16 h-16 object-cover rounded-md"
      />

      <div>
        <h4 className="font-semibold text-lg">{product.name}</h4>
        <p className="text-gray-500 text-sm">{product.description}</p>
      </div>

      <button
        onClick={() => removeFromWishlist(product.id)}
        className="text-red-600 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default Wishlist;
