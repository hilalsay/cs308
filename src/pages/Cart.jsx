import React from "react";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);


  const navigate = useNavigate();

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
  };

  const totalPrice = calculateTotal(cartItems);

  return (
    <div className="border-t pt-14">
      <div className="text-4xl mb-5 ">
        <h1>Jewelry Cart</h1>
      </div>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
            />
          ))}
          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>

            <button
              onClick={() => {
                if (isLoggedIn()) {
                  navigate("/checkout");
                } else {
                  navigate("/login");
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, removeFromCart }) => (
  <div className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
    <h4>{item.name}</h4>
    <p>Price: ${item.price.toFixed(2)}</p>
    <p>Quantity: {item.quantityInCart}</p>
    <button onClick={() => removeFromCart(item.id)}>Remove</button>
  </div>
);

export default Cart;

//flex items-start gap-6