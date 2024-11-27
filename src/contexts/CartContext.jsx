import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  
  

  const fetchCartFromDB = async () => {
    try {
      console.log("cart token:", localStorage.getItem("token"));
      const response = await axios.get("http://localhost:8080/api/cart/view", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setCartItems(data.items || []);
      console.log(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart from DB:", error);
    }
  };

  const syncCartToDB = async () => {
    if (isSyncing) {
      console.log("Sync already in progress.");
      return;
    }
    setIsSyncing(true);
    console.log(cartItems)
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        //console.log(item);
        try {
          await axios.post(
            `http://localhost:8080/api/cart/add/${item.id}/1`,
            {
              productId: item.id,
              quantity: item.quantityInCart,
            },
            {
              headers: {
                //"Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(`Item ${item.name} added to the database.`);
        } catch (error) {
          console.error(`Failed to add item ${item.name} to DB:`, error);
        }
      }
      console.log("Cart synced successfully, clearing local storage...");
      localStorage.removeItem("cart");
      setCartItems([]);
    } else {
      console.log("No items in the cart to sync.");
    }
    setIsSyncing(false);
    console.log("Fetching new cart from database");
    fetchCartFromDB();
  };

  
  useEffect(() => {
    console.log("cart token:", token);
    if (token) {
      syncCartToDB();
    } else {
      if (cartItems.length === 0) {
        localStorage.removeItem('cart');
      } else {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    }
  }, [token]);  // Only re-run when token changes
  
  
  useEffect(() => {
    // Sync when the page loads (initial mount).
    console.log("Syncing cart on initial load");
    if (token) {
      syncCartToDB(); // Fetch the cart from the database if a token exists.
    } else {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        // Parse and set the cart items if they exist in localStorage.
        setCartItems(JSON.parse(storedCart));
      }
    }
    //setCartItems(updatedCart);
  }, []);

  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart;

    if (token) {
      try {
        await axios.post(
          `http://localhost:8080/api/cart/add/${product.id}/1`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        //local cart
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
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        console.log("added to carts");
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
    else{
      //local cart
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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    
    
  };

  const addToLocalCart = async (product) => {

    //for local cart
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
    localStorage.setItem("cart", JSON.stringify(updatedCart));

  }

  const removeFromCart = async (itemId) => {
    

    if (token) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        console.log(`Item ${itemId} removed from the backend`);
      } catch (error) {
        console.error(`Failed to remove item ${itemId} from the backend:`, error);
      }
    }

    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
  };

  const clearCart = async () => {
    setCartItems([]);
    /*
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
    }*/
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
