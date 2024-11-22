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
    setToken(token);
    localStorage.setItem("token", token);
  };

  // Function to log out the user and clear the token from localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
