import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Assuming you have AuthContext for managing user state

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);  // Access user from AuthContext
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (user) {
      console.log("logged in cart");
      // When user logs in, fetch cart from DB (if available)
      syncCartToDB();
      fetchCartFromDB();
    } else {
      // When user is logged out, the cart is stored in localStorage
      if (cartItems.length === 0) {
        localStorage.removeItem('cart');
      } else {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    }
  }, [user, cartItems]);

  // Fetch cart from database when the user logs in
  const fetchCartFromDB = async () => {
    try {
      const response = await fetch(`/api/cart/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (data.items) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart from DB:', error);
    }
  };

  // Sync the cart to the DB for logged-in users
  const syncCartToDB = async () => {
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        try {
          const response = await fetch(`/api/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantityInCart,
            }),
          });
  
          if (response.ok) {
            console.log(`Item ${item.name} added to the database.`);
          } else {
            console.error(`Error adding item ${item.name}:`, await response.text());
          }
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
  };
  

  const addToCart = async (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;
  
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, quantityInCart: item.quantityInCart + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantityInCart: 1 }];
    }
  
    setCartItems(updatedCart);
  
    // Sync with localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // If the user is logged in, sync with the backend
    if (user) {
      try {
        await fetch(`/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: existingItem ? existingItem.quantityInCart + 1 : 1,
          }),
        });
        console.log("Cart updated on the backend");
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      // Optionally remove cart from DB if the user is logged in
      syncCartToDB(); 
    }
    localStorage.removeItem('cart'); // Remove cart from localStorage when logged out
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
