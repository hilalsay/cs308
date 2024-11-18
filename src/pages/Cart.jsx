import React from "react";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
  };

  const totalPrice = calculateTotal(cartItems);

  return (
    <div className="cart-container">
      <h2>Jewelry Cart</h2>
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
            <button onClick={() => alert("Proceeding to checkout...")}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, removeFromCart }) => (
  <div className="cart-item">
    <h4>{item.name}</h4>
    <p>Price: ${item.price.toFixed(2)}</p>
    <p>Quantity: {item.quantityInCart}</p>
    <button onClick={() => removeFromCart(item.id)}>Remove</button>
  </div>
);

export default Cart;
