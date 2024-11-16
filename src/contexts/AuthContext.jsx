import React, { createContext, useState, useEffect } from 'react';

// Create a Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if there's user data and token in localStorage when the app first loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
    }
  }, []);

  // Function to login user and store user and token
  const login = (userData, token) => {
    setUser(userData);
    // Store both user data and token in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
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
