import React, { createContext, useState, useEffect } from 'react';

// Create a Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if there's user data and token in localStorage when the app first loads
  /*
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
    }
  }, []);*/

  // Function to login user and store user and token
  const login = async ({token}) => {
    setUser(token);
    
    localStorage.setItem("token", token);
    console.log("token in auth", token);


    // Migrate localStorage cart to the database
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length > 0) {
      try {
        // Use existing add endpoint for each cart item
        for (const item of localCart) {
          await fetch(`/api/cart/add/${token}/${item.productId}/${item.quantity}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
        }
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Cart migration failed:", error);
      }
    }
  };

  // Function to logout user and clear storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');  // Ensure to clear user data as well
    setUser(null);  // Reset the user state
  };

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
