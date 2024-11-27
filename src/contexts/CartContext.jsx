import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // Assuming you have AuthContext for managing user state
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext); // Access user from AuthContext
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false); // Track if sync is in progress

  useEffect(() => {
    if (token) {
      console.log("logged in cart");
      // When user logs in, fetch cart from DB (if available)
      //syncCartToDB();
      fetchCartFromDB();
    } else {
      // When user is logged out, the cart is stored in localStorage
      if (cartItems.length === 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    }
  }, [token, cartItems]);

  // Fetch cart from database when the user logs in
  const fetchCartFromDB = async () => {
    try {
      console.log("cart token: ", localStorage.getItem("token"));
      const response = await axios.get("http://localhost:8080/api/cart/view", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart from DB:", error);
    }
  };

  // Sync the cart to the DB for logged-in users
  const syncCartToDB = async () => {
    if (isSyncing) {
      console.log("Sync already in progress.");
      return; // Prevent syncing if it's already in progress
    }

    setIsSyncing(true); // Start syncing
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/cart/add/${item.id}/1`,
            {
              productId: item.id,
              quantity: item.quantityInCart,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(`Item ${item.name} added to the database.`);
        } catch (error) {
          console.error(`Failed to add item ${item.name} to DB:`, error);
        }
      }

      // Clear the cart after syncing
      console.log("Cart synced successfully, clearing local storage...");
      localStorage.removeItem("cart");
      setCartItems([]);
    } else {
      console.log("No items in the cart to sync.");
    }

    setIsSyncing(false); // End syncing
  };

  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantityInCart: 1 }];
    }

    setCartItems(updatedCart);

    // Sync with localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // If the user is logged in, sync with the backend
    if (token) {
      try {
        await axios.post(
          `http://localhost:8080/api/cart/add/${product.id}/1`,
          {
            productId: product.id,
            quantity: existingItem ? existingItem.quantityInCart + 1 : 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Cart updated on the backend");
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(`Item ${itemId} removed from the backend`);
      } catch (error) {
        console.error(
          `Failed to remove item ${itemId} from the backend:`,
          error
        );
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (token) {
      try {
        await axios.delete("http://localhost:8080/api/cart/clear", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Cart cleared on the backend");
      } catch (error) {
        console.error("Failed to clear cart on the backend:", error);
      }
    }
    localStorage.removeItem("cart"); // Remove cart from localStorage when logged out
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
