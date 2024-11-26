import React, { createContext, useState, useEffect } from "react";

// Create a Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Initialize the token state from localStorage when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to log in the user and store the token in localStorage
  const login = (token) => {
    const tokenString = token.token || token;  // Extract token string if it's an object
    setToken(tokenString);
    console.log("auth token: ", tokenString);
    localStorage.setItem("token", tokenString); // Store the token string
  };
  

  // Function to log out the user and clear the token from localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

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
