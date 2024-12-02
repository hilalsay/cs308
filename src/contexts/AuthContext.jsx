import React, { createContext, useState, useEffect } from "react";

// Create a Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert Base64URL to Base64
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  
  // Initialize the token state from localStorage when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("Token in localStorage:", storedToken);
      const payload = decodeJWT(storedToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        setToken(storedToken);
      } else {
        console.warn("Token expired or invalid, logging out...");
        logout();
      }
    }
  }, []);
  


  const login = (receivedToken) => {
    const tokenString = typeof receivedToken === "string" ? receivedToken : receivedToken.token;
    console.log("Storing token:", tokenString);
    setToken(tokenString);
    localStorage.setItem("token", tokenString);
  };
  
  

  // Function to log out the user and clear the token from localStorage
  const logout = async () => {
    try {
      // Clear cart explicitly through the CartContext
      if (window.dispatchEvent) {
        window.dispatchEvent(new Event("logout")); // Custom event
      }
  
      // Clear auth state and localStorage
      setToken(null);
      localStorage.removeItem("token");
  
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  

useEffect(() => {
  console.log("cartItems updated:", cartItems);
}, [cartItems]);


  const isLoggedIn = () => {
    return !!token; // Returns true if the token exists, false otherwise
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };