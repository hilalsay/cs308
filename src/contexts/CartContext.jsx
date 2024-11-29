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
    const token = localStorage.getItem("token");
  

    if (!token) {
      console.error("No token found. Please log in.");
      return; 
    }
  
    try {
      console.log("cart token:", localStorage.getItem("token"));
      const response = await axios.get("http://localhost:8080/api/cart/view", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },  
      });
      const data = response.data;
      console.log(data);
      setCartItems(data.items);
      console.log(cartItems);
    } catch (error) {
     
      console.error("Failed to fetch cart from DB:", error.response ? error.response.data : error.message);
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
        console.log(item);
        try {
          await axios.post(
            `http://localhost:8080/api/cart/add/${item.id}/${item.quantity}`,
            {
              productId: item.id,
              quantity: item.quantity,
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
      //setCartItems([]);
    } else {
      console.log("No items in the cart to sync.");
    }
    setIsSyncing(false);
    console.log("Fetching new cart from database");
    await fetchCartFromDB();
  };

  const confirmCheckout = async (checkoutData, token, navigate, setLoading) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/confirm",
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from AuthContext
          },
        }
      );
  
      if (response.status === 200) {
        navigate("/invoice", { state: response.data }); // Navigate to the invoice page with response data
      }
    } catch (error) {
      console.error("Checkout failed:", error);
  
      if (error.response) {
        console.error("Response error:", error.response);
        if (error.response.status === 401) {
          alert("Session expired. Please log in again.");
        } else {
          alert(`Error: ${error.response.data.message || "Checkout failed."}`);
        }
      } else {
        alert("Failed to complete the order. Please try again.");
      }
    } finally {
      setLoading(false); // Stop the loading state
    }
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
    const handleLogout = () => {
      setCartItems([]); // Clear state
      localStorage.removeItem("cart"); // Clear localStorage
    };
  
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);
  
  
  useEffect(() => {
    // Sync when the page loads (initial mount).
    console.log("Syncing cart on initial load");
    if (token) {
      fetchCartFromDB(); // Fetch the cart from the database if a token exists.
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
  
    // Ensure that the product is structured correctly before adding it to the cart
    const formattedProduct = {
      id: product.id,
      name: product.name || "Unnamed Product",
      description: product.description || "No description available",
      price: product.price || 0,
      quantity: 1,  // Default quantity
      stockQuantity: product.stockQuantity || 0,
      serialNumber: product.serialNumber || "",
      imageData: product.imageData || "",
      product: product,  // Ensure that the 'product' attribute is included
    };
  
    if (token) {

      try {
        // Send a request to add the product to the backend cart
        await axios.post(
          `http://localhost:8080/api/cart/add/${product.id}/1`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        // Update the local cart
        if (existingItem) {
          updatedCart = cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...cartItems, { ...formattedProduct, quantity: 1 }];
        }
  
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
  
        console.log("Added to cart and synced with backend");
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    } else {
      // For local cart when not logged in
      if (existingItem) {
        updatedCart = cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cartItems, { ...formattedProduct, quantity: 1 }];
      }
  
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };
  


  useEffect(() => {
    console.log("Updated cart items:", cartItems);
  }, [cartItems]);

  const addToLocalCart = async (product) => {

    //for local cart
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

  }

  const removeFromCart = async (itemId) => {
    console.log('Attempting to remove item:', itemId);
    if (token) {
      try {
        console.log('Authorization Header:', `Bearer ${localStorage.getItem("token")}`);
        console.log('id: ', itemId.product.id);
        const response = await axios.delete(
          `http://localhost:8080/api/cart/remove/${itemId.product.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        console.log('Response from backend:', response);
        console.log(`Item ${itemId} removed from the backend`);
      } catch (error) {
        console.error(`Failed to remove item ${itemId} from the backend:`, error);
      }
    }
  
    // Update cart locally
    const updatedCart = cartItems.filter((item) => item.id !== itemId.id);  // Ensure correct id property is used
    setCartItems(updatedCart);  // Update state to trigger re-render
    localStorage.setItem("cart", JSON.stringify(updatedCart));  // Sync with localStorage
  };
  
  

  const clearCart = async () => {
    setCartItems([]);
    /*
    if (token) {
      try {
        await axios.delete("http://localhost:8080/api/cart/clear", {
          headers: {
            Authorization: `Bearer ${token}`,
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
      value={{ cartItems, addToCart, removeFromCart, clearCart, confirmCheckout }}
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
