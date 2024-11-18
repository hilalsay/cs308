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
      const response = await fetch(`/api/cart/view/${user.id}`, {
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
    if (user) {
      try {
        await fetch(`/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ cartItems }),
        });
      } catch (error) {
        console.error('Failed to sync cart to DB:', error);
      }
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantityInCart: item.quantityInCart + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantityInCart: 1 }]);
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
