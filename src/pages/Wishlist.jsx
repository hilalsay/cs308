import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming you have a way to get the user's JWT token (e.g., from localStorage)
  const token = localStorage.getItem("token"); // or useContext to access the token from a global state

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8080/api/wishlist/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setWishlist(response.data.products); // Assuming the response contains a 'products' field
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching wishlist");
          setLoading(false);
        });
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [token]);

  const removeFromWishlist = (productId) => {
    axios
      .delete(`http://localhost:8080/api/wishlist/me/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setWishlist(wishlist.filter((product) => product.id !== productId)); // Remove product from state
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
        setWishlist([]); // Clear the state
      })
      .catch(() => {
        setError("Error clearing wishlist");
      });
  };

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const styles = {
    wishlistContainer: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    product: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      padding: "10px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "5px 10px",
      backgroundColor: "#ff0000",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
  };
  return (
    <div style={styles.wishlistContainer}>
      <h2>Your Wishlist</h2>
      <button onClick={clearWishlist}>Clear Wishlist</button>
      <ul>
        {wishlist.length === 0 ? (
          <li>No products in wishlist</li>
        ) : (
          wishlist.map((product) => (
            <li key={product.id} style={styles.product}>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <button
                onClick={() => removeFromWishlist(product.id)}
                style={styles.button}
              >
                Remove from Wishlist
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Wishlist;
